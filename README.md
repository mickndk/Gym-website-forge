# Forge Fitness Studio — Website Files

## Folder structure (root folder for FTP upload)

```
forge-fitness/
├── index.html        Home page
├── about.html         About page
├── contact.html        Contact page
├── css/
│   └── style.css       Shared stylesheet (all pages)
├── js/
│   └── main.js         Shared JavaScript (all pages)
├── php/
│   └── contact.php      Contact form handler
└── README.md
```

## Naming conventions used

- All file and folder names are lowercase, no spaces, hyphen-separated where needed (industry-standard web-safe naming).
- Page files are named after their content (`index.html`, `about.html`, `contact.html`) rather than generic names.
- Assets are grouped by type into `css/`, `js/`, and `php/` subfolders so the root stays clean for FTP upload.

## JavaScript functionality included (js/main.js)

1. Mobile navigation toggle (hamburger menu)
2. Class schedule day filter (Home page)
3. Testimonial slider (Home page)
4. Photo gallery lightbox (About page)
5. Contact form client-side validation + AJAX submission (Contact page)

## PHP functionality included (php/contact.php)

- Server-side validation of the contact form (name, email, phone, message)
- Sanitises input and emails the enquiry to the studio inbox via `mail()`

## Testing locally

The site is static HTML/CSS/JS except for the contact form, which posts to
`php/contact.php`. To test the PHP handler locally:

1. Install a local PHP server (e.g. XAMPP, WAMP, or run `php -S localhost:8000`
   from the project root if PHP is installed).
2. Open `http://localhost:8000/contact.html` in your browser (not as a local
   `file://` path — PHP needs to run through a server).
3. Submit the form. If your local environment doesn't have an SMTP/mail
   server configured, `mail()` will return false — this is expected in most
   local dev setups. For grading/demo purposes you can temporarily swap the
   `mail()` call in `contact.php` for a `file_put_contents()` write to a log
   file to prove the data pipeline works end to end.

## Uploading via FTP

Upload the entire contents of this folder (not the folder itself) to the
website's root directory (commonly `public_html` or `www` on student
hosting), preserving the `css/`, `js/`, and `php/` subfolder structure.
