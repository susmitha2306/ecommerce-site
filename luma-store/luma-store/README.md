# LUMA Store — HTML / CSS / JS project

Open `index.html` in a browser (or serve the folder: `python3 -m http.server`). No build step, no dependencies.

## Structure
- `index.html` — shell, loads CSS and JS
- `css/style.css` — base components and layout
- `css/theme.css` — modern bento/glass theme (edit this to restyle)
- `js/data.js` — product/order/customer data, app state, helpers, theme
- `js/components.js` — Btn, Badge, Card, Grid, Table, Line/Bars charts
- `js/cart.js` — cart drawer, totals, coupons
- `js/store.js` — navbar, search, storefront
- `js/product.js` — quick view, product page, gallery zoom
- `js/checkout.js` — 3-step checkout and confirmation
- `js/admin.js` — 10-page admin dashboard
- `js/router.js` — hash router, skeleton loading, scroll reveal

Admin: `#/admin/overview`. Coupons: SAVE10, FREESHIP, WELCOME20.
