<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
  <title>Data entry Grid</title><button id='crm-btn-process' class = 'crm-button'>Process</button>
  <button onclick="openDetails()">Open Item Edit for active row</button>
</head>
<body>
<table width="100%">
  <tr>
    <td valign="top" width="50%">
      <div id="myGrid" style="width:{$gridWidth}px;height:500px;"></div>
    </td>
    <td valign="top">
    </td>
  </tr>
</table>

{literal}
<script id="contactIDTemplate" type="text/x-jquery-tmpl">
  <div class='item-details-form'>
    <div class='item-details-form-buttons'>
      <button data-action='save'>Save</button>
      <button data-action='cancel'>Cancel</button>
    </div>
    {{each columns}}
    <div class='item-details-label'>
      ${name}
    </div>
    <div class='item-details-editor-container' data-editorid='${id}'></div>
    {{/each}}

    <hr/>
    <div class='item-details-form-buttons'>
      <button data-action='save'>Save</button>
      <button data-action='cancel'>Cancel</button>
    </div>
  </div>
</script>
<script id="addressTemplate" type="text/x-jquery-tmpl">
<div id='locationField'> <input id='autocomplete'
placeholder='${street_address}' type='text'></input>"
  </div>
  <table id='address'>
    <tr>
    <td></td>
    <td id='shared_address'></td>
    </tr>
  <tr> <td class='label'>Street address</td>
  <td class='slimField'><input class='field' id='street_number' disabled='true' value = '${street_number}'></input></td>
      <td class='wideField' colspan='2'><input class='field' id='route' disabled='true'></input></td>
    </tr>
    <tr>
      <td class='label'>City</td>
      <td class='wideField' colspan='3'><input class='field' id='locality' value = '${city}' disabled=${contact_id}'></input></td>
    </tr>
    <tr>
      <td class='label'>State</td>
      <td class='slimField'><input class='field' id='administrative_area_level_1' disabled='true'></input></td>
      <td class='label'>Postal code</td>
      <td class='wideField'><input class='field' id='postal_code' value='${postal_code}' disabled='true'></input></td>
    </tr>
    <tr>
      <td class='label'>Country</td>
      <td class='wideField' colspan='3'><input class='field' id='country' disabled='true'></input></td>
    </tr>
  </table>
  </div>
</script>
{/literal}
</body>
</html>
