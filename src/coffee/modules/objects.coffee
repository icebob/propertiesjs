_	= require("lodash")

module.exports = class PJSObjectHandler
	constructor: (@objs) ->

	# Change objs 
	setObjects: (@objs) ->

	# Get object value by path. E.g. user.name.nickName
	getObjectValueByPath: (o, s) ->
		unless s? then return
		s = s.replace(/\[(\w+)\]/g, '.$1')
		# convert indexes to properties
		s = s.replace(/^\./, '')
		# strip a leading dot
		a = s.split('.')
		i = 0
		n = a.length
		while i < n
			k = a[i]
			if o[k] isnt undefined
				o = o[k]
			else
				# Missing parent property. Exit
				return null
			++i
		return o	
		
	# Set object value by path. E.g. user.name.nickName
	setObjectValueByPath: (o, s, val) ->
		s = s.replace(/\[(\w+)\]/g, '.$1')
		# convert indexes to properties
		s = s.replace(/^\./, '')
		# strip a leading dot
		a = s.split('.')
		i = 0
		n = a.length
		while i < n
			k = a[i]
			if i < n - 1
				if o[k] isnt undefined
					# Found parent property. Step in
					o = o[k] 
				else
					# Create missing property (new level)
					o[k] = {}
					o = o[k]
			else
				# Set final property value
				o[k] = val
				return
			
			++i
		return		
	
	# Get field value from objects array
	getValueFromObjects: (field, defValue) ->
		res = null
		_.each @objs, (obj, i) =>
			val = @getObjectValueByPath obj, field

			# Ha van default érték és csak 1 objektum van, akkor a default értéket kapja meg
			# és be is kell állítani neki
			if not val? and @objs.length is 1 and defValue?
				@setObjectValueByPath obj, field, defValue
				res = defValue
				return false

			# Összefésülni a meglévő értékekkel.
			# Tömb esetén intersection
			# Érték esetén ha eltér akkor null
			if res is null
				res = val
			else
				if val? and _.isArray res
					res = _.intersection res, val
				else if res isnt val
					res = null
					return false


			return
		
		return res

	# Set field new value to objects in array
	setValueToObjects: (field, value) ->
		_.each @objs, (obj, i) =>
			@setObjectValueByPath obj, field, value
			return

	# Has function in all objects
	hasFunctionInObjects: (field) ->
		if !@objs? or @objs.length == 0 or !field? then return false
		has = true
		_.each @objs, (obj, i) -> unless _.isFunction(obj[field]) then has = false
		return has

	# Call function on every objects
	callFunctionInObjects: (functionName) =>
		_.each @objs, (obj) -> obj[functionName](obj) if obj[functionName]?		

	# Apply changes on objects (if no liveEdit)
	applyChanges: (changesObject) ->
		_.each @objs, (obj) ->
			_.assign obj, changesObject