chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  
  switch (request.action) {
    case 'adfs-get-saml-token':
      {
        var providerUrl = request.providerUrl;
        var providerRelyingParty = request.providerRelyingParty;

        var xhr = new XMLHttpRequest();
        xhr.open('POST', providerUrl, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
          if(xhr.readyState == XMLHttpRequest.DONE) {

            if (xhr.status == 200) {
              var match = xhr.responseText.match(/\<input type="hidden" name="SAMLResponse" value="([^"]+)" \/>/);
              if (match.length < 2) {
                sendResponse({ 'success': false });
              } else {
                sendResponse({ 'success': true, 'samlToken': match[1] });
              }
            } else {
              sendResponse({ 'success': false });
            }
					}
				}

        data =   'SignInOtherSite=' + 'SignInOtherSite';
        data += '&RelyingParty=' + providerRelyingParty;
        data += '&SignInSubmit=' + 'Sign+in';
        data += '&SingleSignOut=' + 'SingleSignOut';

        xhr.send(data);

        return true;
      }

    case 'assume-role-with-saml':
      {
				var url = 'https://signin.aws.amazon.com/saml';
        var data = {
          'SAMLResponse': request.samlToken,
          'name': '',
          'portal': '',
          'roleIndex': request.roleIndex
        };

				chrome.tabs.create(
				  { url: chrome.runtime.getURL('aws-saml-fake-form.html') },
				  function(tab) {
				    var handler = function(tabId, changeInfo) {
				      if(tabId === tab.id && changeInfo.status === 'complete'){
				        chrome.tabs.onUpdated.removeListener(handler);
				        chrome.tabs.sendMessage(tabId, {url: url, data: data});
				      }
				    }
				
				    chrome.tabs.onUpdated.addListener(handler);
				    chrome.tabs.sendMessage(tab.id, {url: url, data: data});
				  }
				);

        break;
      }

    default:
      {
        console.log('i have no clue what to do.');
        break;
      }
  }

  return true;
});
