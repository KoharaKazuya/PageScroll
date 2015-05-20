$(function() {
  chrome.storage.local.get({
    searchheight: 25
  }, function(values) {
    // set previous values
    $('input[name="searchheight"]').val(values.searchheight);
    $('#searchheight_display').text(values.searchheight);

    $('input[name="searchheight"]').on('input', function() {
      $('#searchheight_display').text($(this).val());
    });
    $('input[name="searchheight"]').on('change', function() {
      chrome.storage.local.set({
        searchheight: $(this).val()
      });
    });
  });
});
