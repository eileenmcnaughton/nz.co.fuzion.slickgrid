/***
 * Contains basic SlickGrid editors.
 * @module Editors
 * @namespace Slick
 */

(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "Editors": {
        "Text": TextEditor,
        "Integer": IntegerEditor,
        "Float": FloatEditor,
        "Date": DateEditor,
        "YesNoSelect": YesNoSelectEditor,
        "Checkbox": CheckboxEditor,
        "PercentComplete": PercentCompleteEditor,
        "LongText": LongTextEditor,
        "SelectOption": SelectCellEditor,
        "SelectContact": SelectContactEditor,
        "SelectContactSimple": SelectContactEditorSimple
      }
    }
  });

  function TextEditor(args) {
    var $input;
    var defaultValue;
    var scope = this;

    this.init = function () {
      $input = $("<INPUT type=text class='editor-text' />")
          .appendTo(args.container)
          .bind("keydown.nav", function (e) {
            if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
              e.stopImmediatePropagation();
            }
          })
          .focus()
          .select();
    };

    this.destroy = function () {
      $input.remove();
    };

    this.focus = function () {
      $input.focus();
    };

    this.getValue = function () {
      return $input.val();
    };

    this.setValue = function (val) {
      $input.val(val);
    };

    this.loadValue = function (item) {
      defaultValue = item[args.column.field] || "";
      $input.val(defaultValue);
      $input[0].defaultValue = defaultValue;
      $input.select();
    };

    this.serializeValue = function () {
      return $input.val();
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
    };

    this.validate = function () {
      if (args.column.validator) {
        var validationResults = args.column.validator($input.val());
        if (!validationResults.valid) {
          return validationResults;
        }
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  function IntegerEditor(args) {
    var $input;
    var defaultValue;
    var scope = this;

    this.init = function () {
      $input = $("<INPUT type=text class='editor-text' />");

      $input.bind("keydown.nav", function (e) {
        if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
          e.stopImmediatePropagation();
        }
      });

      $input.appendTo(args.container);
      $input.focus().select();
    };

    this.destroy = function () {
      $input.remove();
    };

    this.focus = function () {
      $input.focus();
    };

    this.loadValue = function (item) {
      defaultValue = item[args.column.field];
      $input.val(defaultValue);
      $input[0].defaultValue = defaultValue;
      $input.select();
    };

    this.serializeValue = function () {
      return parseInt($input.val(), 10) || 0;
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
    };

    this.validate = function () {
      if (isNaN($input.val())) {
        return {
          valid: false,
          msg: "Please enter a valid integer"
        };
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  //https://github.com/stanislavgeorgiev/SlickGrid/blob/192bb52b233307c0d6d86c88bdabaa6dfecafd90/slick.editors.js
  function FloatEditor(args) {
    var $input;
    var defaultValue;
    var scope = this;

    this.init = function () {
      $input = $("<INPUT type=text class='editor-text' />");

      $input.bind("keydown.nav", function (e) {
        if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
          e.stopImmediatePropagation();
        }
      });

      $input.appendTo(args.container);
      $input.focus().select();
    };

    this.destroy = function () {
      $input.remove();
    };

    this.focus = function () {
      $input.focus();
    };

    this.loadValue = function (item) {
      defaultValue = item[args.column.field];
      $input.val(defaultValue);
      $input[0].defaultValue = defaultValue;
      $input.select();
    };

    this.serializeValue = function () {
      return parseFloat($input.val(), 10) || 0;
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
    };

    this.validate = function () {
      if (isNaN($input.val())) {
        return {
          valid: false,
          msg: "Please enter a valid decimal number"
        };
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  function DateEditor(args) {
    var $input;
    var defaultValue;
    var scope = this;
    var calendarOpen = false;

    this.init = function () {
      $input = $("<INPUT type=text class='editor-text' />");
      $input.appendTo(args.container);
      $input.focus().select();
      $input.datepicker({
        showOn: "button",
        buttonImageOnly: true,
        buttonImage: CRM.Setting.extensionURL + "/packages/SlickGrid/images/calendar.gif",
        beforeShow: function () {
          calendarOpen = true
        },
        onClose: function () {
          calendarOpen = false
        }
      });
      $input.width($input.width() - 18);
    };

    this.destroy = function () {
      $.datepicker.dpDiv.stop(true, true);
      $input.datepicker("hide");
      $input.datepicker("destroy");
      $input.remove();
    };

    this.show = function () {
      if (calendarOpen) {
        $.datepicker.dpDiv.stop(true, true).show();
      }
    };

    this.hide = function () {
      if (calendarOpen) {
        $.datepicker.dpDiv.stop(true, true).hide();
      }
    };

    this.position = function (position) {
      if (!calendarOpen) {
        return;
      }
      $.datepicker.dpDiv
          .css("top", position.top + 30)
          .css("left", position.left);
    };

    this.focus = function () {
      $input.focus();
    };

    this.loadValue = function (item) {
      defaultValue = item[args.column.field];
      $input.val(defaultValue);
      $input[0].defaultValue = defaultValue;
      $input.select();
    };

    this.serializeValue = function () {
      return $input.val();
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
    };

    this.validate = function () {
      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  function YesNoSelectEditor(args) {
    var $select;
    var defaultValue;
    var scope = this;

    this.init = function () {
      $select = $("<SELECT tabIndex='0' class='editor-yesno'><OPTION value='yes'>Yes</OPTION><OPTION value='no'>No</OPTION></SELECT>");
      $select.appendTo(args.container);
      $select.focus();
    };

    this.destroy = function () {
      $select.remove();
    };

    this.focus = function () {
      $select.focus();
    };

    this.loadValue = function (item) {
      $select.val((defaultValue = item[args.column.field]) ? "yes" : "no");
      $select.select();
    };

    this.serializeValue = function () {
      return ($select.val() == "yes");
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return ($select.val() != defaultValue);
    };

    this.validate = function () {
      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  function CheckboxEditor(args) {
    var $select;
    var defaultValue;
    var scope = this;

    this.init = function () {
      $select = $("<INPUT type=checkbox value='true' class='editor-checkbox' hideFocus>");
      $select.appendTo(args.container);
      $select.focus();
    };

    this.destroy = function () {
      $select.remove();
    };

    this.focus = function () {
      $select.focus();
    };

    this.loadValue = function (item) {
      defaultValue = !!item[args.column.field];
      if (defaultValue) {
        $select.prop('checked', true);
      } else {
        $select.prop('checked', false);
      }
    };

    this.serializeValue = function () {
      return $select.prop('checked');
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (this.serializeValue() !== defaultValue);
    };

    this.validate = function () {
      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  function PercentCompleteEditor(args) {
    var $input, $picker;
    var defaultValue;
    var scope = this;

    this.init = function () {
      $input = $("<INPUT type=text class='editor-percentcomplete' />");
      $input.width($(args.container).innerWidth() - 25);
      $input.appendTo(args.container);

      $picker = $("<div class='editor-percentcomplete-picker' />").appendTo(args.container);
      $picker.append("<div class='editor-percentcomplete-helper'><div class='editor-percentcomplete-wrapper'><div class='editor-percentcomplete-slider' /><div class='editor-percentcomplete-buttons' /></div></div>");

      $picker.find(".editor-percentcomplete-buttons").append("<button val=0>Not started</button><br/><button val=50>In Progress</button><br/><button val=100>Complete</button>");

      $input.focus().select();

      $picker.find(".editor-percentcomplete-slider").slider({
        orientation: "vertical",
        range: "min",
        value: defaultValue,
        slide: function (event, ui) {
          $input.val(ui.value)
        }
      });

      $picker.find(".editor-percentcomplete-buttons button").bind("click", function (e) {
        $input.val($(this).attr("val"));
        $picker.find(".editor-percentcomplete-slider").slider("value", $(this).attr("val"));
      })
    };

    this.destroy = function () {
      $input.remove();
      $picker.remove();
    };

    this.focus = function () {
      $input.focus();
    };

    this.loadValue = function (item) {
      $input.val(defaultValue = item[args.column.field]);
      $input.select();
    };

    this.serializeValue = function () {
      return parseInt($input.val(), 10) || 0;
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (!($input.val() == "" && defaultValue == null)) && ((parseInt($input.val(), 10) || 0) != defaultValue);
    };

    this.validate = function () {
      if (isNaN(parseInt($input.val(), 10))) {
        return {
          valid: false,
          msg: "Please enter a valid positive number"
        };
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  /*
   * An example of a "detached" editor.
   * The UI is added onto document BODY and .position(), .show() and .hide() are implemented.
   * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
   */
  function LongTextEditor(args) {
    var $input, $wrapper;
    var defaultValue;
    var scope = this;

    this.init = function () {
      var $container = $("body");

      $wrapper = $("<DIV style='z-index:10000;position:absolute;background:white;padding:5px;border:3px solid gray; -moz-border-radius:10px; border-radius:10px;'/>")
          .appendTo($container);

      $input = $("<TEXTAREA hidefocus rows=5 style='background:white;width:250px;height:80px;border:0;outline:0'>")
          .appendTo($wrapper);

      $("<DIV style='text-align:right'><BUTTON>Save</BUTTON><BUTTON>Cancel</BUTTON></DIV>")
          .appendTo($wrapper);

      $wrapper.find("button:first").bind("click", this.save);
      $wrapper.find("button:last").bind("click", this.cancel);
      $input.bind("keydown", this.handleKeyDown);

      scope.position(args.position);
      $input.focus().select();
    };

    this.handleKeyDown = function (e) {
      if (e.which == $.ui.keyCode.ENTER && e.ctrlKey) {
        scope.save();
      } else if (e.which == $.ui.keyCode.ESCAPE) {
        e.preventDefault();
        scope.cancel();
      } else if (e.which == $.ui.keyCode.TAB && e.shiftKey) {
        e.preventDefault();
        args.grid.navigatePrev();
      } else if (e.which == $.ui.keyCode.TAB) {
        e.preventDefault();
        args.grid.navigateNext();
      }
    };

    this.save = function () {
      args.commitChanges();
    };

    this.cancel = function () {
      $input.val(defaultValue);
      args.cancelChanges();
    };

    this.hide = function () {
      $wrapper.hide();
    };

    this.show = function () {
      $wrapper.show();
    };

    this.position = function (position) {
      $wrapper
          .css("top", position.top - 5)
          .css("left", position.left - 5)
    };

    this.destroy = function () {
      $wrapper.remove();
    };

    this.focus = function () {
      $input.focus();
    };

    this.loadValue = function (item) {
      $input.val(defaultValue = item[args.column.field]);
      $input.select();
    };

    this.serializeValue = function () {
      return $input.val();
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
    };

    this.validate = function () {
      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  function SelectCellEditor(args) {
    var $select;
    var defaultValue;
    var scope = this;

    this.init = function() {

        if(args.column.options){
          opt_values = args.column.options;
        }else{
          opt_values = ['yes','no'];
        }
        option_str = ""
        for( i in opt_values ){
            v = opt_values[i];
            option_str += "<OPTION value='"+i+"'>"+v+"</OPTION>";
        }
        $select = $("<SELECT tabIndex='0' class='editor-select'>"+ option_str +"</SELECT>");
        $select.appendTo(args.container);
        $select.focus();
  };

    this.destroy = function() {
        $select.remove();
    };

    this.focus = function() {
        $select.focus();
    };

    this.loadValue = function(item) {
      defaultValue = item[args.column.field];
      $select.val(defaultValue);
    };

    this.serializeValue = function() {
        if(args.column.options){
          return $select.val();
        }else{
          return ($select.val() == "yes");
        }
    };

    this.applyValue = function(item,state) {
        item[args.column.field] = state;
    };

    this.isValueChanged = function() {
        return ($select.val() != defaultValue);
    };

    this.validate = function() {
        return {
            valid: true,
            msg: null
        };
    };

    this.init();
  }

    /*
     * An example of a "detached" editor.
     * The UI is added onto document BODY and .position(), .show() and .hide() are implemented.
     * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
     */
    function SelectContactEditor(args) {
        var $input;
        var defaultValue;
        var scope = this;
        var container = $("body");

        this.init = function() {

          $wrapper = $("<div class='contact-box'/>")
            .appendTo(container);

          $input = $("<input rows=1.5 id='editor-autocomplete' class='editor-autocomplete'/>")
              .appendTo($wrapper);
       /*   $("<DIV style='text-align:right'><BUTTON>Save</BUTTON><BUTTON>Cancel</BUTTON></DIV>")
                .appendTo($wrapper);
         */

          $(" OR <select id='new_contact'> <option value=''>- create new contact -</option>"
              + "<option value='new_individual'>New Individual</option>"
              + "<option value='new_organization'>New Organization</option>"
              + "<option value='new_household'>New Household</option></select>" +
              "</div>" +
              "<div id='new_profile' class='api_call' data-entity='profile'></div>" +
              "<div id='addresses' data-entity='address'></div>" +
              "<div style='text-align:right'><BUTTON>Save</BUTTON><BUTTON>Cancel</BUTTON></DIV>")
                .appendTo($wrapper);


          assignAutoComplete('#editor-autocomplete', '.active');

          $wrapper.find("button:first").bind("click", this.save);
          $wrapper.find("button:last").bind("click", this.cancel);
          $input.bind("keydown", this.handleKeyDown);
          scope.position(args.position);
          $input.focus().select();
          if(args.item[args.column.field]) {
            buildContactForm($input, args.item[args.column.field]);
          }
          $('#new_contact').on('change', function(){
            rebuildContactForm($('#editor-autocomplete'));
          });
        };


        this.destroy = function() {
            $wrapper.remove();
        };

        this.focus = function() {
          console.log($select);
          console.log(args);
            $input.focus();

        };

        this.loadValue = function(item) {
          $input.val(defaultValue = item[args.column.field + '_name']);
          $input.select();
        };

        this.serializeValue = function() {
          return $input.val();
        };

        this.applyValue = function(item, state) {
          if(!$input.attr('entity_id')){
            item[args.column.field] = null;
            item[args.column.field + '_name'] = '';
          }
          item[args.column.field] = $input.attr('entity_id');
          item[args.column.field + '_name'] = state;
        };

        this.isValueChanged = function() {
            return ($input.val() != defaultValue);
        };

        this.validate = function() {
            return {
                valid: true,
                msg: null
            };
        };

        this.save = function (event) {
          var inputs = $('#new_profile input');
          var profileDiv = $('#new_profile');
          var profileID = $(profileDiv).val();
          var params  = profileDiv.data('api_params');
          $.each(inputs, function ( index, value){
            params[$(value).data('field')] = $(value).val();
          });
          var contactID = $input.attr('entity_id');
          if(contactID) {
            params['contact_id'] = contactID;
          }
          else {
            params['contact_type'] = params['profile_id'].replace('new_', '');
          }
          CRM.api('contact', 'create',  params, {
            success: function(result) {
              contactID = result.id;
              displayName = result['values'][contactID]['display_name'];
              args.item[args.column.field] = contactID;
              args.item[args.column.field + '_name'] = displayName;
              $input.attr('entity_id', result.id);

              // see https://groups.google.com/forum/#!searchin/slickgrid/navigation/slickgrid/WfW6V7n6Gyo/4ZTKapZFR6QJ
              // for why I set autoEdit on & off
              // (to prevent the navigation going down) & hopefully some response
              // it prevents it going down bug ...
              //args.grid.setOptions({autoEdit:false});
            //perhaps here we bind a listener
              // @todo not cool this - but for now...
              var gridParams = {};
              gridParams['grid_id'] = CRM.form.grid_id;
              gridParams[args.column.field] = contactID;
              gridParams[args.column.field + '_name'] = displayName;
              CRM.api('SlickGrid', 'create', gridParams);
             // args.commitChanges();
              //args.grid.setOptions({autoEdit:true});
              //args.grid.navigateUp();
              args.grid.navigateNext();
            },
            error: function(result) {
            }
          });
        };

        this.cancel = function () {
            $input.val(defaultValue);
            args.cancelChanges();
        };
        this.position = function (position) {
            $wrapper
              .css("top", position.top - 5)
              .css("left", position.left - 5)
        };

        this.handleKeyDown = function (e) {
          if (e.which == $.ui.keyCode.ENTER && e.ctrlKey) {
            scope.save();
          } else if (e.which == $.ui.keyCode.ESCAPE) {
            e.preventDefault();
            scope.cancel();
          } else if (e.which == $.ui.keyCode.TAB && e.shiftKey) {
            e.preventDefault();
            args.grid.navigatePrev();
          } else if (e.which == $.ui.keyCode.TAB) {
            e.preventDefault();
            args.grid.navigateNext();
          }
          else if (e.which == 13) {
            e.preventDefault();
            if (options.editable) {
              if (currentEditor) {
                // adding new row
                if (activeRow === getDataLength()) {
                  navigateRight();
                } else {
                  commitEditAndSetFocus();
                }
              } else {
              if (getEditorLock().commitCurrentEdit()) {
                makeActiveCellEditable();
              }
            }
          }
          handled = true;
        }
        };

        this.init();
    }
    function SelectContactEditorSimple(args) {
      var $input;
      var defaultValue;
      var scope = this;
      var container = $("body");

      this.init = function() {

      $wrapper = $("<div class='contact-box'/>")
        .appendTo(container);

        $input = $("<input rows=1.5 id='editor-autocomplete' class='editor-autocomplete'/>")
            .appendTo($wrapper);
        var url = CRM.url('civicrm/ajax/contactref', 'context=customfield&id=' + args.column.field.replace('custom_', ''));
        assignAutoComplete('#editor-autocomplete', '.active', url);
        $wrapper.find("button:first").bind("click", this.save);
        $wrapper.find("button:last").bind("click", this.cancel);
        $input.bind("keydown", this.handleKeyDown);
        scope.position(args.position);
        $input.focus().select();
      };


      this.destroy = function() {
          $wrapper.remove();
      };

      this.focus = function() {
        $input.focus();

      };

      this.loadValue = function(item) {
        $input.val(defaultValue = item[args.column.field + '_name']);
        $input.select();
      };

      this.serializeValue = function() {
        return $input.val();
      };

      this.applyValue = function(item, state) {
        if(!$input.attr('entity_id')){
          item[args.column.field] = null;
          item[args.column.field + '_name'] = '';
        }
        item[args.column.field] = $input.attr('entity_id');
        item[args.column.field + '_name'] = state;
      };

      this.isValueChanged = function() {
          return ($input.val() != defaultValue);
      };

      this.validate = function() {
          return {
              valid: true,
              msg: null
          };
      };

      this.save = function (event) {
        args.commitChanges();
      };

      this.cancel = function () {
          $input.val(defaultValue);
          args.cancelChanges();
      };
      this.position = function (position) {
          $wrapper
            .css("top", position.top - 5)
            .css("left", position.left - 5)
      };

      this.handleKeyDown = function (e) {
        if (e.which == $.ui.keyCode.ENTER && e.ctrlKey) {
          scope.save();
        } else if (e.which == $.ui.keyCode.ESCAPE) {
          e.preventDefault();
          scope.cancel();
        } else if (e.which == $.ui.keyCode.TAB && e.shiftKey) {
          e.preventDefault();
          args.grid.navigatePrev();
        } else if (e.which == $.ui.keyCode.TAB) {
          e.preventDefault();
          args.grid.navigateNext();
        }
      };

      this.init();
  }
})(jQuery);
