cj(function ($) {
  'use strict';
  $('button').on('click', function(event){
    event.stopPropagation();
    CRM.api('slick_batch', 'delete', {'id' : $(this).data('gridid')});
    $(this).closest('tr').remove();
  })
});
