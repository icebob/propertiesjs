window.PJSGroupStates = {}

module.exports = 

	getGroupState: (name, defValue) ->
		if window.PJSGroupStates[name]?
			return window.PJSGroupStates[name]

		return defValue

	setGroupState: (name, state) -> window.PJSGroupStates[name] = state