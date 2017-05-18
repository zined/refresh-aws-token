# Prerequisites

https://aws.amazon.com/blogs/security/enabling-federation-to-aws-using-windows-active-directory-adfs-and-saml-2-0/

# Installation

    $ pip install git+https://github.com/zined/refresh-aws-token

# Future Plans

 * move from `IdpInitiatedSignOn.aspx` and parsing HTML/XML to using WS-TRUST. ADFS exposes that via `/adfs/services/trust/mex`
 * do not repeat `saml_provider_*` for each profile
 * incorporate into `awscli` 

# Usage

Get a Ticket Granting Ticket (`kinit USERNAME@DOMAIN`)

create an awscli profile for the account you want to access in ~/.aws/config

e.g. `sso-foo-readonly`. Ensure that the configuration values match your ADFS Installation.

`saml_provider_relying_party` is actually the `<option>`s value of your `signin.aws.amazon.com` entry on your `IdpInitiatedSignOn.aspx`

    [profile sso-foo-readonly]
    region = eu-central-1
    saml_provider = ADFS-HTTP
    saml_provider_url = https://adfsurl.example.org/adfs/ls/IdpInitiatedSignOn.aspx
    saml_provider_krb_service = HTTP/adfsurl.example.org@EXAMPLE.ORG
    saml_provider_relying_party = aaaaaaaa-1111-bbbb-2222-cccccccccccc
    saml_role = arn:aws:iam::12345678901:saml-provider/ADFS,arn:aws:iam::12345678901:role/ADFS-ReadOnly

now refresh your tokens:

    $ AWS_PROFILE=sso-foo-readonly aws sts get-caller-identity
    Unable to locate credentials. You can configure credentials by running "aws configure".
    $
    $ refresh-aws-token --profile=sso-foo-readonly
    $
    $ AWS_PROFILE=sso-foo-readonly aws sts get-caller-identity
    {
    "Account": "12345678901",
    "UserId": "AAAAAAAAAAAAAAAAAAAAA:username@example.org",
    "Arn": "arn:aws:sts::12345678901:assumed-role/ADFS-ReadOnly/username@example.org"
    }
    $
