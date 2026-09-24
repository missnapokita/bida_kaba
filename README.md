# Bida Reels download website

Static GitHub Pages website for `bidareels.com`.

## Set the APK download link

Open `app-config.json` and place the direct APK URL in `apk_url`:

```json
"apk_url": "https://github.com/YOUR-USERNAME/YOUR-REPOSITORY/releases/download/v1.1/BidaReels-v1.1.apk"
```

The same JSON file controls the displayed version, APK size, download count, update date, and What’s New list.

## Publish with GitHub Pages

1. Upload every file and folder in this repository to the repository root.
2. Open **Settings → Pages**.
3. Select **Deploy from a branch**, choose `main` and `/ (root)`, then save.
4. The included `CNAME` is set to `bidareels.com`.
5. In your domain DNS, connect the apex domain to GitHub Pages using GitHub’s current custom-domain instructions, then enable **Enforce HTTPS** in Pages settings.

If your final domain is different, replace `bidareels.com` in `CNAME`, `index.html`, `robots.txt`, and `sitemap.xml`.
