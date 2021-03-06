/***
 * Contains basic SlickGrid formatters.
 *
 * NOTE:  These are merely examples.  You will most likely need to implement something more
 *        robust/extensible/localizable/etc. for your use!
 *
 * @module Formatters
 * @namespace Slick
 */

(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "Formatters": {
        "PercentComplete": PercentCompleteFormatter,
        "PercentCompleteBar": PercentCompleteBarFormatter,
        "YesNo": YesNoFormatter,
        "Checkmark": CheckmarkFormatter,
        "Select" : SelectFormatter,
        "Contact" : ContactFormatter,
      }
    }
  });

  function PercentCompleteFormatter(row, cell, value, columnDef, dataContext) {
    if (value == null || value === "") {
      return "-";
    } else if (value < 50) {
      return "<span style='color:red;font-weight:bold;'>" + value + "%</span>";
    } else {
      return "<span style='color:green'>" + value + "%</span>";
    }
  }

  function PercentCompleteBarFormatter(row, cell, value, columnDef, dataContext) {
    if (value == null || value === "") {
      return "";
    }

    var color;

    if (value < 30) {
      color = "red";
    } else if (value < 70) {
      color = "silver";
    } else {
      color = "green";
    }

    return "<span class='percent-complete-bar' style='background:" + color + ";width:" + value + "%'></span>";
  }

  function YesNoFormatter(row, cell, value, columnDef, dataContext) {
    return value ? "Yes" : "No";
  }

  function CheckmarkFormatter(row, cell, value, columnDef, dataContext) {
    return value ? "<img src='" + CRM.Setting.extensionURL + "/packages/SlickGrid/images/tick.png'>" : "";
  }

  function SelectFormatter(row, cell, value, columnDef, dataContext) {
    if(columnDef.options[value]) {
      return columnDef.options[value];
    }
    return '';
  }

  function CurrencyFormatter(row, cell, value, columnDef, dataContext) {
    //@todo use civicrm currency
    if (value === null || value === "" || !(value > 0)) {
      return "$" + Number();
    } else {
      return "$" + Number(value).toFixed(2);
    }
  }

  function ContactFormatter(row, cell, value, columnDef, dataContext) {
    return dataContext[columnDef['field'] + '_name'];
  }
})(jQuery);
