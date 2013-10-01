
//if this looks very similar to the same-named file I added to core recently it is because it is (shame) copy & paster
// and even more shame - the key reason I'm having to do this is I ignored / deferred Xavier's advice to
// pass in a selector rather than an id
function assignAutoComplete(select_field, id_field, url, varmax, profileids) {
  if(varmax === undefined) {varmax = 10;}
  if(profileids === undefined) {profileids = [];}

  if(url === undefined) {
    url = CRM.url('civicrm/ajax/rest', 'className=CRM_Contact_Page_AJAX&fnName=getContactList&json=1');
  }

    var customObj   = cj(select_field);
    var customIdObj = cj(id_field);

    // the api still not being fully consistent
    if (!customObj.hasClass('ac_input')) {
        customObj.autocomplete(url,
            { width : 250, selectFirst : false, matchContains: true, max: varmax }).result(
            function (event, data) {
                var contactID = data[1];
                var displayName = data[0];
                //having trouble doing an
                customObj.val(contactID + '~~' + displayName);
                customObj.attr('entity_id', contactID);
                customObj.attr('display_name', displayName);
                buildContactForm(customObj, contactID);
            }
        );
        customObj.click(function () {
            customIdObj.val('');
        });
    }
}

function buildContactForm(customObj, contactID) {
  var profileFieldValue;
  var profileDiv = $('#new_profile');
  var addressDiv = $('#address').html('<div></div>');
  profileID = $('#new_contact').val();
  if(!contactID && !profileID) {
    return;
  }
  if(!profileID) {
    profileID = 'new_individual'
  }
  var primaryFieldName; //we track the possible alternate name of the email field because we are struggling with
  CRM.api('profile', 'get', {
    'profile_id' : profileID,
    'contact_id' : contactID,
    }, {
      success: function(result) {

          cj.each(result.values, function (id, value){
            var profilehtml = '<div class="crm-entity" data-entity="contact" data-id=' + contactID + '><table>';
              cj.each(CRM.Profile[profileID], function (fieldname, fieldvalue) {
                primaryFieldName = fieldname + '-primary';
                if(!fieldvalue.name || -1 == ($.inArray(fieldvalue.entity, ['address', 'email', 'phone', 'contact']))) {
                  return;
                }

                if(value[fieldvalue.name]) {
                  profileFieldValue = value[fieldvalue.name];
                }
                else if(value[primaryFieldName]) {
                  //argh still inconsistencies around email!!
                  profileFieldValue = value[primaryFieldName];
                }
                else {
                  profileFieldValue = '';
                }
                if(fieldvalue.entity == 'address') {
                  // we are going to do addresses separately
                }
                else {
                  profilehtml += "<div><tr><td>" +  fieldvalue.title
                  profilehtml += "</td><td></td><td>"
                  profilehtml += '<span data-field="' + fieldvalue.name + '" data-action="create" class =  "crm-editable">'
                  profilehtml += profileFieldValue
                  profilehtml += '</span></td><td></td></tr></div>';
                }

             });
             profilehtml += '</table></div>';
             profileDiv.html(profilehtml);
             //customObj.after(profilehtml);
             cj('.crm-editable').crmEditable ();
          });
      }
  });
  if(contactID) {
  CRM.api('address', 'get', {
    'contact_id' : contactID,
    'return' : 'street_address, supplemental_address_1, street_name, street_unit, city, state_province_id'
  }, {
      success: function(result) {
        cj.each(result.values, function (id, value){
          CRM.api('address', 'match', value, {success: function(result) {
            $('#shared_address').html(result.count + " contacts have the same address");
          }});
          var addresshtml = '<div class="crm-entity" data-entity="address" data-id=' + contactID + '><table>';
            cj.each(value, function (fieldname, fieldvalue) {
              addresshtml += "<div><tr><td>" +  fieldname
              addresshtml += "</td><td>"
              addresshtml += '<span data-field="' + fieldvalue + '" data-action="create" class =  "crm-editable">'
              addresshtml += '</span></td></tr></div>';

           });
           addresshtml += '</table></div>';
       //    var combo = customObj.after(addresshtml);
           cj('.crm-editable').crmEditable ();
           $modal = $("#addressTemplate")
           .tmpl(value)
           .insertAfter(profileDiv);
           initializeGoogle()
        });
    }
  });
  }
}

var placeSearch,autocomplete;
var component_form = {
  'street_number': 'short_name',
  'route': 'long_name',
  'locality': 'long_name',
  'administrative_area_level_1': 'short_name',
  'country': 'long_name',
  'postal_code': 'short_name'
};
function initializeGoogle() {
  var options = {
    bounds: new google.maps.Circle({center:new google.maps.LatLng( CRM.Domain.geo_code_1, CRM.Domain.geo_code_2 ),
      radius:50000}).getBounds(),
    types: ['geocode']
  };

  autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), options);
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    fillInAddress();
  });
}
function fillInAddress() {
  var place = autocomplete.getPlace();
  console.log(place);
  for (var component in component_form) {
    document.getElementById(component).value = "";
    document.getElementById(component).disabled = false;
  }
  for (var j = 0; j < place.address_components.length; j++) {
    var att = place.address_components[j].types[0];
    if (component_form[att]) {
      var val = place.address_components[j][component_form[att]];
      document.getElementById(att).value = val;
    }
  }
}
function geolocate() {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode( { 'address': 'New Zealand'}, function(results, status) {
     if (status == google.maps.GeocoderStatus.OK) {
       map.setCenter(results[0].geometry.location);
       map.fitBounds(results[0].geometry.viewport);
     }
   });
}
