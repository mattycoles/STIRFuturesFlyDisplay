# STIRFuturesFlyDisplay
Display page which displays data related to STIR Future instrument prices. Page is used by perp traders as a reference on current market prices to influence trades.

## OVERVIEW ##

All data is being collected from a MS SQL Database which is updated every 10 minutes with market data. AJAX is used to call PHP from Javascript and retrieve the data requested from the front end by the user. The PlotyJS library is used in order to display the data onto a chart which visualises the data in different ways depending on the page/tool that is being used.

## INDEX ##

The index page will loads a list of the available contracts depending on the product selected. For example, if SONIA is selected all contracts for this product will loads on the page. When selecting a contract, this will display the FLY price for this product for the last 24 hours. 

## PRICE RATIO PLUS ##

This page is similar to the index tool, however it enables the ability to compare two products.

## PRODUCT OVERLAY ##

This page overlays each product over the top of each other for the selected contract month (HMUZ).

## FLY CURVE ##

This page displays the current yield curve for each contract. It can also overlay multiple products yield curves on top of each other.


On all pages a control panel is also shown that enables more options to the page user. The panel can update the date range to set periods but also has the option to select a custom date range. This is all handled by JS, which then calls PHP using XHTML.


## HOW TO USE ##
Update the conn.php file with your SQL DB details.

SQL DB will need three tables, one for each product (SONIA, SOFR, EURIBOR).

SQL Tables will need the following collumn names in order to display data correctly:

Date (26/10/2022 09:10)

SoFF3	(data value int for Spread of fly of fly)

SoFS3	(data value int for Spread of spread of fly)

Contract	(contract name i.e. SR3 SEP22)

High (high price for period as int)

Low	 (low price for period as int)

FoFF3 (the spread of the two other data values SoFF3 and SoFS3)
