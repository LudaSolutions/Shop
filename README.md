# Luda Atelier GitHub Pages Site

This is a static GitHub Pages website. Upload all files in this folder to your GitHub repository and enable GitHub Pages from the repository settings.

## Main Files

- `index.html` - home page with the main announcement carousel and four bag styles.
- `all-bags.html` - all bag styles page.
- `ready-bag-kits.html` - ready bag kits page.
- `bespoke.html` - order form page for JetForm.
- `order-tracker.html` - customer order status lookup page.
- `fabric-guide.html` - fabric guide page.
- `size-guide.html` - size guide page.
- `color-palette.html` - two color sliders with fabric swatches.
- `order-process.html` - order process page.
- `delivery-duty.html` - delivery and duty page.
- `about-us.html` - founder and contact page.

## Jotform Links

The order form is already connected to:

```text
https://form.jotform.com/LudaSolutions/OrderForm
```

It is written in two places:

```js
assets/js/site.js
const JETFORM_ORDER_FORM_URL = "https://form.jotform.com/LudaSolutions/OrderForm";
```

And directly in:

```html
bespoke.html
<iframe src="https://form.jotform.com/LudaSolutions/OrderForm">
```

This direct iframe is important: it lets the order form load even if GitHub has not refreshed the JavaScript yet.

If you ever change the order form URL, replace it in both `assets/js/site.js` and `bespoke.html`.

For contact forms, paste the contact form URL into:

```js
const JETFORM_CONTACT_FORM_URL = "";
```

in `assets/js/site.js`.

## Important GitHub Upload Check

Upload the full contents of this folder to the repository root, not the folder itself.

The repository should show this structure:

```text
index.html
bespoke.html
order-tracker.html
assets
  css
    style.css
  js
    site.js
  images
.nojekyll
```

If `bespoke.html` opens without menu/design, GitHub is not loading `assets/css/style.css` and `assets/js/site.js`. Check that the `assets` folder is uploaded exactly with lowercase letters.

## Order Tracker

Jotform should write paid orders into a Google Sheet tab named `Orders`.

Use these columns:

```text
Order Number
Email
Status
Updated
Product
```

In Jotform, add a hidden field named `Status` with the default value:

```text
processing
```

Map that hidden field into the Google Sheet `Status` column. Then new paid orders start as `processing`, and you can manually edit the status in Google Sheets later.

Paste the Google Apps Script code from `../google-apps-script-order-tracker.js` into the Google Sheet via `Extensions -> Apps Script`, deploy it as a Web app, and paste its `/exec` URL into:

```js
const ORDER_TRACKER_API_URL = "";
```

## Connect Jotform to Google Sheets

1. Open the order form in Jotform.
2. Go to `Settings` -> `Integrations`.
3. Choose `Google Sheets`.
4. Connect your Google account.
5. Select or create the spreadsheet for orders.
6. Make sure the sheet columns include `Order Number`, `Email`, `Status`, `Updated`, and `Product`.
7. In Jotform, add a hidden field named `Status` with default value `processing`.
8. Map the Jotform fields into the Google Sheet columns.
9. After payment, Jotform will add the row to Google Sheets. You can manually edit `Status` later.

Then connect the tracker:

1. Open the Google Sheet.
2. Go to `Extensions` -> `Apps Script`.
3. Paste the code from `../google-apps-script-order-tracker.js`.
4. Deploy as `Web app`.
5. Set access to `Anyone`.
6. Copy the `/exec` URL.
7. Paste it into `assets/js/site.js`:

```js
const ORDER_TRACKER_API_URL = "PASTE_GOOGLE_APPS_SCRIPT_EXEC_URL_HERE";
```

## Changing Images

Images are in `assets/images/`.

For hover sliders, edit the `data-gallery` value on each product card:

```html
data-gallery="assets/images/image-1.jpg|assets/images/image-2.jpg|assets/images/image-3.jpg"
```

Use the `|` character between image links.

## Ready Bag Kits Categories

Edit categories in `ready-bag-kits.html`:

```html
<button class="kit-category" type="button" data-kit-filter="wedding-events">
  <img src="assets/images/wedding-gifts.jpg" alt="">
  <span>Weddings & Events</span>
</button>
```

Each kit card has category tags:

```html
data-categories="wedding-events jewelry-accessories"
```

Use the same words in `data-kit-filter` and `data-categories`. The grid shows 8 kits first. Add more kit cards below and the `View more` / `Next page` controls will handle the next 8.
