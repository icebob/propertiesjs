$ = require "jquery"

module.exports = 

	getContainer: (c) -> 
		if c?
			c = if typeof c is "string" then $(c) else c
			c.addClass("propertyEditor") unless c.hasClass("propertyEditor")
		return c

	generatePJSTable: (PJS) ->

		# Table header
		thead = $("<thead/>").append( 
			$("<tr/>").append(
				$("<th/>").append([ 
					$("<span/>").addClass("title").text(PJS.schema.windowTitle || "Properties"),
					$("<span/>").addClass("subTitle").text(PJS.schema.windowSubTitle || "#{PJS.objectHandler.objs.length} selected object(s)")
				])
			)	
		)
		# Table body
		tbody = $("<tbody/>")

		# Table footer
		tfoot = $("<tfoot/>")

		if PJS.liveEdit is false
			tfoot.append(
				$("<tr/>").append(
					$("<td/>").append(
						$("<div/>").addClass("pjsButtons").append([
							$("<button>").addClass("save").text("Save")
							$("<button>").addClass("cancel").text("Cancel")
						])
					)
				)
			)


		# Add to table
		tables = [
			$("<table/>").append thead
			$("<table/>").append tbody
			$("<table/>").append tfoot
		]

		return [tables, thead, tbody, tfoot]

	generateEditorRow: (PJS, editor, groupField) ->

		tr = $("<tr/>").attr "data-field", editor.field
		tr.addClass "group-" + groupField if groupField?

		nameCell = $("<td/>").text editor.title
		
		# Tooltip text with question mark
		if editor.toolTip?
			nameCell.prepend $("<span/>").addClass("toolTip").attr("data-title", editor.toolTip)
		
		tr.append nameCell
		tr.addClass("featured") if editor.featured is true
		tr.addClass("readonly") if editor.readonly is true
		tr.addClass("required") if editor.required is true
		tr.addClass(editor.type)
			
		editorCell = $("<td/>").addClass(editor.type).appendTo tr
		editorCell.append $("<div/>").addClass("errors")
		editorCell.append $("<div/>").addClass("hint")

		return [tr, nameCell, editorCell]


	generateGroupRow: (PJS, editor) ->

		tr = $("<tr/>").attr "data-field", editor.field
		tr.addClass "group"

		nameCell = $("<td/>").text editor.title
		nameCell.append $("<span />").addClass "arrow"
		
		# Tooltip text with question mark
		if editor.toolTip?
			nameCell.prepend $("<span/>").addClass("toolTip").attr("data-title", editor.toolTip)
		
		
		tr.append nameCell
		tr.addClass("featured") if editor.featured is true
		tr.addClass("readonly") if editor.readonly is true
		tr.addClass("collapsed") if editor.collapsed is true
		tr.addClass(editor.type)
			
		editorCell = $("<td/>").addClass(editor.type).appendTo tr

		return [tr, nameCell, editorCell]		
