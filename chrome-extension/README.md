# Step 1: generate a config from your existing ~/.aws/config

    $ ./create-chrome-extension-config > config.js

# Step 2: install extension in chrome

 * open chrome
 * open `chrome://extensions`
 * enable 'Developer Mode'
 * click 'Load unpacked extension'
 * navigate to $THIS folder
 * click 'Select'

# Step 3: usage

 * ensure you have a kerberos ticket (`$ kinit YOUR_USER_ID@EXAMPLE.ORG`)
 * click the new icon in your chrome
 * select the AWS account you want to login to
 * be happy
