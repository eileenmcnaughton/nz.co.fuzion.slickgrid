  function requiredFieldValidator(value) {
    if (value == null || value == undefined || !value.length) {
      return {valid: false, msg: "This is a required field"};
    } else {
      return {valid: true, msg: null};
    }
  }

  function formatter(row, cell, value, columnDef, dataContext) {
    return value;
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
      5000 : Slick.Editors.SelectContact
    };

    if(types[type]) {
      return types[type];
    }
    //1024 - money
    return Slick.Editors.Text;
  }


  var grid;
  var columns = CRM.Form.Columns;

  var options = {
    enableCellNavigation: true,
    enableColumnReorder: true,
    enableAddRow: true,
    editable: true
  };

  $('#crm-btn-process').on('click', function(){
    CRM.api('slick_batch', 'submit', {'id': CRM.form.grid_id})
  });

  $(function () {
    var data = CRM.Form.Data;
    $.each(columns, function(field, specs){
      if(columns[field]['editor'] == 1024) {
        columns[field]['formatter'] = Slick.Formatters.Currency;
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

    grid = new Slick.Grid("#myGrid", data, columns, options);
    grid.setSelectionModel(new Slick.CellSelectionModel());

    grid.onCellChange.subscribe(function (e, args) {
      var cell = grid.getCellFromEvent(e);
      if (typeof(args.item.id)=='undefined') {
        var columnName = grid.getColumns()[args.cell].id;
        var input = data[args.row][grid.getColumns()[args.cell].field];
        var row = args.row;
        var params = {'id' : row + 1};
        params[columnName] = input;
        params['grid_id'] = CRM.form.grid_id;
        CRM.api('SlickGrid', 'create', params);
      }
      else{
        // dunno - ??? - what does the if achieved - I chopped & pilfered it
      }

    });

    grid.onAddNewRow.subscribe(function (e, args) {
      var item = args.item;//CRM.api('SlickGrid', 'create', params);
      grid.invalidateRow(data.length);
      data.push(item);
      grid.updateRowCount();
      var numberOfRows = grid.getDataLength();
      var params = args.item;
      params['id'] = numberOfRows;
      params['grid_id'] = CRM.form.grid_id;
      CRM.api('SlickGrid', 'create', params);
      grid.render();
    });
  })
