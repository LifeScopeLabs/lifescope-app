---
breadcrumbs:
  - '[Learn](/learn)'
  - '[Connections and Providers](/connections)'
---

# In Lifescope terms, what's a Connection, and what's a Provider?

We call a third-party service from which you want to retrieve data a Provider.
Facebook, Twitter, GitHub, and Spotify are all Providers to us.

A Connection is your authorization for us to retrieve your data from a Provider.
A Connection is primarily made up of the credentials we obtain on your behalf, as well as Permissions.
Connections can be named whatever you'd like; if you don't pick a name during creation, we will fill in one based on some unique information about the account, usually the service's unique identifier for you.

Permissions are the different options for what can be retrieved from a Provider; for example, the Google Provider has Permissions for Gmail and Drive.
Data is only retrieved if the Permission for it is enabled.

# How can I make more Connections?

Go to app.lifescope.io/providers.
The grid you see will look very similar to the signup/login page, with the major difference being that some of the boxes will be colored.
The colored Provider boxes are ones where you have at least one Connection already.
If any of the boxes have numbers, that indicates how many Connections you have to that Provider; no number, but colored, means you have just one.
Click on a Provider's box, select the permissions you want to grant and name it if you'd like, click 'Connect to <service>', and then follow the service's authorization procedure.

# Can I make more than one Connection to a Provider?

Yes, but only if you have more than one account with that Provider.
If you try to make a second Connection to the exact same account, the new one will be deleted, as will whatever Permissions you selected.
If you have multiple accounts with a service, though, you may make a Connection to each of them.

For example, let's say you signed up using your personal Google account, and gave Lifescope Permissions for Gmail and your Drive history.
If you tried to make another Connection to your personal Google account and only selected the Drive permission, this second Connection would be discarded and your original Connection would still have the Gmail and Drive Permissions.
If you start a Connection with just the Drive permission, but selected your work Google account, a Connection to that other Google account would be made, and it would only be able to access your work Google's Drive history.
The personal Google Connection would still have access to both Gmail and Drive.

# I have multiple Twitter/Instagram/etc. accounts and made a Connection to one; how do I switch to the others to make Connections to them?

Most Providers only let you be logged in to one account at once.
If you want to make Connections to more than one, you need to make a Connection to the first one and authorize it, then log out of that Provider's account and log into another one, then make a Connection to that Provider.
Don't log out of Lifescope unless you want those Connections to be in separate Lifescope accounts.

For example, you have two Instagram accounts; one for all of your followers, and a private one just for friends and family.
You're currently logged into your public Instagram account.
When you're logged into Lifescope, you make a Connection to Instagram; finishing that process will make a Connection to your public Instagram account.
You would then log out of the public Instagram account, log into your friends and family Instagram account, then make another Connection to Instagram.
This time through the Connection process will result in a Connection to your friends and family Instagram account, resulting in two Connections to Instagram.

Some Providers, such as Google, let you pick which account to authorize during the authorization process.
You don't need to log out/log in for these.

# How can I edit or delete my Connections?

Go to your [Connection settings](/settings/connections).
You will see a list of your Connections; click on one to see all of its information.
You can change the name, enable and disable Permissions, enable and disable the Connection as a whole, and delete the Connection.

## Changing a Connection's Name
To change the name, just alter what's in the text box and click somewhere outside the box or hit enter.

## Changing a Connection's Permissions
Checking the checkbox next to a Permission will enable it, and unchecking it will disable it.
For some Providers, changing the Permissions requires that you re-authorize the Connection.
A large 'Reauthorize' button will appear if this is required, with some text underneath explaining that you need to re-authorize or else data retrieval may not work properly.

This reauthorization is necessary because, with many Providers, we use the Permissions to limit the scope of data we can retrieve.
If the Provider supports it, telling us not to retrieve, say Gmail messages will prompt us to not request access to your Gmail messages from Google, and the credentials they return to us cannot access Gmail for you. 
If you later want to retrieve data from Gmail and enable that Permission, we need to obtain new credentials from Google that have permission to access Gmail.

Note that some Providers don't automatically devolve these data 'scopes' as explicitly as others.
If you initially requested Facebook Posts and Events, then later disabled the Posts Permission and reauthorize your Facebook Connection, Facebook may still grant us access to your Posts because you'd previously allowed it.
The most foolproof way to reduce the data Lifescope has access to is to delete the Connection, then go to that service and remove Lifescope from your 'Connected Apps' (this process is different for each Provider), then make a new Connection with just the Permissions you want.

## Enabling and Disabling a Connection.

Just click on the enable/disable button in the lower left, and confirm if it's a disable.
Disabled Connections will not have any more data retrieved through them, though any data that has already been retrieved will remain.

## Deleting a Connection

Just click on the Delete button in the lower right and confirm on the window that appears.
All of the data that has been collected via that Connection will be deleted.
If you have more than one Connection to a Provider, other Connections and their data will not be affected.

# Why can't I delete my last Connection?

Because Lifescope's account management runs entirely off of your Connections, deleting all of your Connections would leave you with no way to log in.
For that reason, we don't let you delete your last Connection.
At that point, you'd probably just want to delete your account altogether, which can be done one the [Account Settings page](/settings/account).
If you do want to keep your account but don't want any new data, just disable all of your Connections.
Alternatively, make a new Connection to another service, then delete the other Connection.
