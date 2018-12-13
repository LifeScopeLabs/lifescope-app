---
breadcrumbs:
  - '[Learn](/learn)'
  - '[Searching your Data and Saved Searches](/searching)'
---

# How do I search my data?

On some pages on the site, primarily the [Explorer](/explore), you'll see a text box on the top of the screen.
This box allows you to customize what data you are searching for.
There are two elements to a search: a text query, and filters.

The text query is entered in the text box, while filters are added from a menu.
The filter menu may be hidden on some pages, but can always be found on the [Explorer](/explore). 

To run a search, either hit enter when the text box is selected or click on the magnifying glass on the right-hand side of the query text box.

## Text Query

Text queries let you search for specific words in your data.
It's like any other search engine - just enter the words and press enter (or click the magnifying glass on the right-hand side).
This search is inclusive of all the words in the query; searching for 'beach horse' will return data that has either 'beach' or 'horse' in them, not data that only has both words.

### Searching via tags

The query box is also used for searching via tags.
For more on tags, see [the page on tags](/learn/tags).
Enter tags preceded by a pound sign/sharp/hashtag, e.g. '#caseofthemondays'.

All tags will be removed from the search query and applied as filters.
For example, entering '#caseofthemondays beach horse' will perform a search with a text query of 'beach horse' and a tag filter of 'caseofthemondays'.
You can enter as many tags as you would like.

## Filters

Filters allow you to narrow down your search results based on various factors.
There are five types of filters: Who, What, When, Connector, and Tag.
Of these, all except Tag are constructed from the controls that are opened by clicking the arrow on the left-hand side of the query text box.

### Opening the filter editor

When you click on the arrow, a box with a few symbols will appear just below the query text box.
Clicking on these symbols will start a new filter of that type; the person is a Who filter, the picture is a What filter, the calendar is a When filter, and the plug is a Connector filter.
After the new filter is started, you can enter the criteria for that filter and name it if you would like.
Click on 'Add Filter' to lock it in and add it to your search; if you close the filter editor or click a different filter type, your unsaved filter data will be discarded.

### Filter boxes

When a filter has been added to the search, you will see it as a little box either to the right of the filter editor or on the right-hand side of the text query box.
If it has a name, the name will appear in the box, otherwise it will just have its type.
When the filter editor dropdown is closed, and the filters appear in the text query box, only a certain number will be shown in order to reserve room for the text query.
The others will be indicated by a box with '+n' to indicate there are n more filters that aren't being displayed.

### Editing filters

Clicking on a filter box in either of these situations will open the filter constructor and populate it with that filter's information.
You may edit the information as you see fit, and clicking on 'Save Filter' will update its information.
Closing the filter editor, or starting a new filter, will erase any changes you made, but the original information in that filter will be preserved.

### Deleting filters

Click on the 'X' on the right-hand side of the filter box to remove it.

### Types of Filters

#### Who Filters (person icon)

Who filters let you search for specific Contacts.
Contacts are primarily comprised of a 'handle' and a name.
If your friend Morgan Jones is on Twitter as '@the_normal_one', they would show up as a Contact with name 'Morgan Jones' and handle 'the_normal_one'.

Unlike text searches, which don't have to match exactly to get hits, Who filters must exactly match the name or handle you're searching for.
A Who filter looking for 'Morgan' won't match 'Morgan Jones', nor will 'the-normal-one' match 'the_normal_one'.

#### What Filters (picture icon)

What filters let you search for sepcific types of Content, such as Videos, Photos, or Text.
Click on the dropdown in the filter editor and then select a Content Type.

#### When Filters (calendar icon)

When filters let you narrow down a date range for Events.
When filters can either be for a specific Date/Time range, e.g. 1:00pm on January 5th, 2013 to 5:45pm on February 17th, 2014, or for a relative date range, e.g. 'Since 3 weeks ago'.
Click on the toggle right underneath the name field to switch between exact and relative dates.

##### Exact dates

Clicking on the text boxes in the filter editor will pop up a Date/Time picker for the start or end date.
The leftmost button will toggle between the date and time pickers, the rightmost button will close the picker, and the middle button will clear your selection.
You cannot select an end date before the start date, and similarly you cannot select a start date after the end date, e.g. you can't search from January 1, 2016 to December 30, 2015, because that wouldn't make sense.
Leaving off the start date will search from the beginning of time up to the end date, and leaving off the end date will search up to the present day.

##### Relative dates

Relative date filters let you give dates from the present day.
The top menu lets you select whether it will be 'Since' a time in the past or 'Exactly' a time in the past.
The text box in the middle lets you enter a number.
The bottom menu lets you select 'Days', 'Weeks', 'Months', or 'Years' ago.

Searching for 'Exactly 3 weeks ago' will filter your search down to Events that happened just on the day that was three weeks ago.
'Since 3 weeks ago' would filter for Events that happend from that day up to the present.

#### Connector Filters (plug icon)

Connector filters allow you to return results either from a specific Provider or from a specific Connection.
Use the toggle to switch between the two, and use the menus that appear to select which Provider or Connection you would like to filter on.

#### Tag Filters

Tag filters let you search for specific Tags on your data.
They are constructed in the query text box, not the filter editor.
See 'Searching via tags' above to learn more.

# What is a Saved Search?

Every time you perform a search with a unique combination of query and filters, we save a record of it so that you can easily run that search again in the future.
We also record how many times a search has been run.
Saved Searches also allow LifeScope to easily transfer searches between pages; if you construct a search on the home page and run it, we save it as a Saved Search, then redirect you to the Explorer with a query parameter 'qid=<search ID>' that can be used to retrieve the search parameters.

## Viewing your Saved Searches

On your [home page](/), the majority of the page is taken up by a list of Saved Searches.
You can change which Searches are shown and how they are organized by clicking on the tabs at the top.
'Favorites' shows only Saved Searches you have Favorited, organized in alphabetical order; 'Recent' shows all Saved Searches organized from most recent to least; and 'Top' shows all Saved Searches from most-run to least-run.
(The fourth tab, 'Tags', shows your Tags, not Saved Searches.)

## Favoriting Searches

While recording your searches is handy, it can be difficult to tell them apart.
Favoriting lets you make your searches unique so that you can easily spot the ones you run the most.
You can open the favorite controls for the search that's currently loaded in the search bar by clicking on the star to the left of the magnifying glass.
In the list of searches on the home page, clicking on the star on the right-hand side of the list entry will open the favoriting controls for that search.
Note that a search's name and icon will only appear if the search is Favorited.

### Favoriting controls

The favoriting controls let you name the search, pick an icon and a color for that icon, unfavorite the search if it's already favorited, favorite it if is currently not favorited, and delete the Saved Search entirely.

#### Name

Enter a name for your search.
As with the icon options, you must click the 'Save' button for changes to take effect.

#### Icon

We have a couple dozen icon options for you to select.
Click one to pick it.
You can click 'Clear Icon' underneath the icon box to clear the icon selection.
As with the name and color options, you must click the 'Save' button for changes to take effect.

#### Icon Color

You may enter any valid hexadecimal RGB color into the box.
We also provide several pre-selected colors that you can click on.
If you enter 'FFF' or 'FFFFFF' and wonder 'where\'s my icon???', you entered the code for white, and it's not showing up on the white background.
As with the name and icon options, you must click the 'Save' button for changes to take effect.

#### Unfavorite

The unfavorite button will appear to the right of the Delete button if the search is favorited.
Clicking it will Unfavorite the search.
The name and icon options will not be removed, but only favorited searches have their name and icon displayed.

#### Save

Clicking 'Save' will update the search with the selected name, icon, and icon color.
If the search is not Favorited, it will be Favorited.

#### Delete

This deletes the Saved Search entirely, including the record of how many times it had been run.
If you re-construct that exact search at a later date and run it again, a new Saved Search will be created, but any name and icon options will not be retained.

## Why are there already Saved Searches in the account I just made?

We thought it would be useful to have some examples prepared for you.
These are created for every new account.
No, we didn't know you had any friends or acquaintances named Steve; everyone gets a default search of 'Stuff from guys named Steve'.
These pre-loaded searches can be used, edited, or deleted as you see fit.
