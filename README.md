# Luda Atelier GitHub Pages Site

This is a static GitHub Pages website. Upload all files in this folder to your GitHub repository and enable GitHub Pages from the repository settings.

## Main Files

- `index.html` - home page with the main announcement carousel and four bag styles.
- `all-bags.html` - all bag styles page.
- `ready-bag-kits.html` - ready bag kits page.
- `bespoke.html` - order form page for JetForm.
- `fabric-guide.html` - fabric guide page.
- `size-guide.html` - size guide page.
- `color-palette.html` - two color sliders with fabric swatches.
- `order-process.html` - order process page.
- `delivery-duty.html` - delivery and duty page.
- `about-us.html` - founder and contact page.

## JetForm Links

Open `assets/js/site.js` and replace these values:

```js
const JETFORM_ORDER_FORM_URL = "";
const JETFORM_CONTACT_FORM_URL = "";
```

The Bespoke page uses a full-width iframe under the menu. Paste your JetForm embed URL into `JETFORM_ORDER_FORM_URL`.

For embedded forms, paste your JetForm iframe into:

- `JETFORM_ORDER_FORM_URL` for the Bespoke page
- `JETFORM_CONTACT_FORM_URL` for About Us and Color Palette contact sections

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
