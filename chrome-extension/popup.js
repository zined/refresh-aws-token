// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var backgroundPage = chrome.extension.getBackgroundPage();

function toggleLoading() {
  var spinner = document.querySelector('.loading-spinner');
  spinner.classList.toggle('is-loading');
  document.querySelectorAll('li').forEach((el) => {
    el.classList.toggle('disabled');
  })
}

function click(e) {
  var role = e.target.getAttribute('data-role');
  var roleIndex = role.split(',')[1];

  var providerUrl = e.target.getAttribute('data-provider-url');
  var providerRelyingParty = e.target.getAttribute('data-provider-relying-party');

  var el = e.target;

  toggleLoading();
  el.style.backgroundColor = 'orange';

  chrome.runtime.sendMessage(
  {
    'action': 'adfs-get-saml-token',
    'providerUrl': providerUrl,
    'providerRelyingParty': providerRelyingParty

  }, function(response) {
      if (response.success) {
        el.style.backgroundColor = 'green';

        // this should open the new aws console tab on success
        chrome.runtime.sendMessage({
          'action': 'assume-role-with-saml',
          'samlToken': response.samlToken,
          'roleIndex': roleIndex
        });
        spinner.classList.remove(loadingClass);
        window.close();

      } else {
        toggleLoading();
        el.style.backgroundColor = 'red';
      }
    });
}

document.addEventListener('DOMContentLoaded', () => {
  var ul = document.getElementById('aws');

  for (var i = 0; i < awsConfig.length; i++) {
    var li = document.createElement('li');
    var tdAccount = document.createElement('td');
    
    li.setAttribute('data-role', awsConfig[i].role);
    li.setAttribute('data-provider-url', awsConfig[i].provider_url);
    li.setAttribute('data-provider-relying-party', awsConfig[i].provider_relying_party);

    li.addEventListener('click', click);
    li.innerText = awsConfig[i].name;

    ul.appendChild(li);
  }
});
