cj(function ($) {
  'use strict';
  function requiredFieldValidator(value) {
    if (value == null || value == undefined || !value.length) {
      return {valid: false, msg: "This is a required field"};
    } else {
      return {valid: true, msg: null};
    }
  }

  /**
   * Translate CiviCRM field type to slickgrid editor type
   * @param string $type
   */
  function getEditorType(type) {
    var types = {
      4 : Slick.Editors.Date,
      12 : Slick.Editors.Date,
      16 : Slick.Editors.Checkbox,
      1024 : Slick.Editors.Float,
      5000 : Slick.Editors.SelectContact,
      5001 : Slick.Editors.SelectContactSimple // without create new
    };

    if(types[type]) {
      return types[type];
    }
    //1024 - money
    return Slick.Editors.Text;
  }


  var grid;
  var columns = CRM.Form.Columns;
  var sortcol = 'id';
  var options = {
    enableCellNavigation: true,
    enableColumnReorder: true,
    enableAddRow: true,
    editable: true,
    showTotalsHeader : true, // doesn't seem to work
    showTotalsFooter : true,
    autoHeight: true, // allows vertical scrolling
    headerRowHeight : 45, // doesn't see to work - have also set by css which does
    cellHighlightCssClass: "invalid",
  };
  /**
   * Pops up the complete form when you click on edit button
   * copied from composite editor example - don't yet understand well enough to relocate / comment appropriately

  function openDetails() {
      if (grid.getEditorLock().isActive() && !grid.getEditorLock().commitCurrentEdit()) {
          return;
      }

      var $modal = $("<div class='item-details-form'></div>");

      $modal = $("#contactIDTemplate")
          .tmpl({
              context: grid.getDataItem(grid.getActiveCell().row),
              columns: columns
          })
          .appendTo("body");

      $modal.keydown(function (e) {
          if (e.which == $.ui.keyCode.ENTER) {
              grid.getEditController().commitCurrentEdit();
              e.stopPropagation();
              e.preventDefault();
          } else if (e.which == $.ui.keyCode.ESCAPE) {
              grid.getEditController().cancelCurrentEdit();
              e.stopPropagation();
              e.preventDefault();
          }
      });

      $modal.find("[data-action=save]").click(function () {
          grid.getEditController().commitCurrentEdit();
      });

      $modal.find("[data-action=cancel]").click(function () {
          grid.getEditController().cancelCurrentEdit();
      });


      var containers = $.map(columns, function (c) {
          return $modal.find("[data-editorid=" + c.id + "]");
      });

      var compositeEditor = new Slick.CompositeEditor(
          columns,
          containers,
          {
              destroy: function () {
                  $modal.remove();
              }
          }
      );

      grid.editActiveCell(compositeEditor);
  }
  */
  $('#crm-btn-process').on('click', function(){
    $('#crm-btn-process').prop("disabled", true).text('processing');
    CRM.api('slick_batch', 'submit', {'id': CRM.form.grid_id}, {
      success : function (result) {
        console.log(result);
        CRM.alert('Your batch submitted successfully');
        window.location.replace(CRM.url("civicrm/civislick"));
      },
      error : function (result) {
        console.log(result);
        CRM.alert('Failed to validate - not submitted');
        $('#crm-btn-process').prop("disabled", false).text('re-submit');
      }
    });
  });
 // $(function () {

    var data = CRM.Form.Data;
    $.each(columns, function(field, specs){
      if(columns[field]['required']) {
        columns[field]['validator'] = requiredFieldValidator;
      }
      if(columns[field]['editor'] == 1024) {
        columns[field]['formatter'] = Slick.Formatters.Currency;
      }
      if(columns[field]['editor'] == 5000) {
        columns[field]['formatter'] = Slick.Formatters.Contact;
      }
      if(columns[field]['editor'] == 5001) {
        columns[field]['formatter'] = Slick.Formatters.Contact;
      }
      columns[field]['editor'] = getEditorType(specs['editor']);
      if(columns[field]['editor'] == Slick.Editors.Checkbox) {
        columns[field]['formatter'] = Slick.Formatters.Checkmark;
      }
      if(columns[field]['options']) {
        columns[field]['editor'] = Slick.Editors.SelectOption;
        columns[field]['formatter'] = Slick.Formatters.Select;
      }
      if(columns[field]['rule'] == 'email') {
        columns[field]['validator'] = Slick.Validators.email;
      }
    });

    var dataView = new Slick.Data.DataView();
    grid = new Slick.Grid("#myGrid", dataView, columns, options);
    grid.setSelectionModel(new Slick.CellSelectionModel());

    //this line probably applies only if we switch to RowSelectionModel
    // which I tried because of the sync fn per below but not working
    //https://github.com/mleibman/SlickGrid/wiki/DataView
    grid.onSelectedRowsChanged.subscribe(function(e, args) {
      var rowID = grid.getSelectedRows();
      var columns = grid.getColumns();
      var item = dataView.getItem(rowID);
      var cellCSS = [];
      $.each(columns, function(columnID, specs){
        if(specs.required) {
          if(item[specs.id]) {
          }
          else {
            cellCSS[specs.id] = 'invalid';
          }
        }
      });
      var rowCSS = {};
      if(cellCSS) {
        rowCSS[rowID] = cellCSS;
        grid.setCellCssStyles("invalid", rowCSS);
        args.row.cssClasses('invalid');
      }
    });

    grid.onCellChange.subscribe(function (e, args) {
      var cell = grid.getCellFromEvent(e);
      var columnName = grid.getColumns()[args.cell].id;
      var input = data[args.row][grid.getColumns()[args.cell].field];
      var row = args.row;
      var params = {'id' : args.item['id']};
      if(args.item[columnName + '_name']) {
        params[columnName + '_name'] = args.item[columnName + '_name'];
      }
      params[columnName] = input;
      params['grid_id'] = CRM.form.grid_id;
      CRM.api('SlickGrid', 'create', params);
      dataView.updateItem(args.item.id, args.item);
    });

    grid.onAddNewRow.subscribe(function (e, args) {
      var item = args.item;
      item["id"] = dataView.getLength() + 1;
      var params = item;
      //fix me - once we start deleting rows need the max id
      params['grid_id'] = CRM.form.grid_id;
      //probably this should be a function of the dataview not the grid
      CRM.api('SlickGrid', 'create', item);
      data.push(item);
      dataView.beginUpdate();
      dataView.setItems(data);
      dataView.endUpdate();
    });


 // wire up model events to drive the grid
    dataView.onRowCountChanged.subscribe(function (e, args) {
      grid.updateRowCount();
      grid.render();
    });

    dataView.onRowsChanged.subscribe(function (e, args) {
      grid.invalidateRows(args.rows);
      grid.render();
    });
    //code for deleting rows
  //http://stackoverflow.com/questions/9126772/slickgrid-cannot-delete-added-rows-but-only-existing-ones-what-am-i-doing-wron

    /* When user clicks button, fetch data via Ajax, and bind it to the dataview.
    $('#mybutton').click(function() {
        CRM.api('slick_grid','get', {'grid_id' : 26}, function(data) {
        dataView.beginUpdate();console,log(data);
        dataView.setItems(CRM.Form.Data);
        dataView.endUpdate();
      });
    });
    */

    grid.onSort.subscribe(function (e, args) {
      console.log(args);
      sortcol = args.sortCol.field;  // Maybe args.sortcol.field ???
      dataView.sort(comparer, args.sortAsc);
    });

    function comparer(a, b) {
      var x = a[sortcol], y = b[sortcol];
      return (x == y ? 0 : (x > y ? 1 : -1));
    }
    dataView.beginUpdate();
    dataView.setItems(CRM.Form.Data);
    dataView.endUpdate();
  })

