# scratch-l10n

Central translation data and locale utilities for NitroBolt.

This package builds on the Scratch and TurboWarp translation catalogs. Those
catalogs remain upstream data so NitroBolt can continue receiving translation
updates. NitroBolt-specific strings and intentional replacements live in the
separate `overrides` directory and are merged on top when the package builds.

## Install

```sh
pnpm install --frozen-lockfile
```

The package builds its generated `locales` and `dist` files through its
`prepare` lifecycle script when installed from GitHub. Pin production consumers
to a commit SHA for reproducible installs.

## Development

```sh
pnpm test
pnpm build
```

Generated files are written to `locales` and `dist`.

## Translation layers

The package applies translations in this order:

1. Scratch editor translations in `editor`
2. Vendored TurboWarp translations in `turbowarp-translations.json`
3. NitroBolt additions in `overrides/editor`

NitroBolt entries take precedence when the same message ID exists in more than
one layer. See `overrides/README.md` for the overlay layout.

## Updating upstream strings

Scratch translations are stored in `editor`. TurboWarp translations are stored
in `turbowarp-translations.json`. Neither source requires access to an upstream
Transifex account during normal development or builds.

Update those files by merging changes from the corresponding upstream Git
repositories. NitroBolt's Transifex synchronization never writes to Scratch or
TurboWarp projects.

After updating the sibling `scratch-gui` fork from TurboWarp, refresh the
vendored TurboWarp catalog with:

```sh
pnpm sync:upstream
```

This is a local file copy and does not contact Transifex.

## NitroBolt Transifex

The `blocks`, `extensions`, `interface`, and `paint-editor` resources belong to
the `nitrobolt` project in the `nitrobolt` Transifex organization. Configure an
API token before synchronizing:

```sh
export TX_TOKEN="your-api-token"
pnpm transifex:pull
pnpm transifex:push
```

`pnpm transifex:push` first runs each sibling repository's existing source
extractor. It writes only NitroBolt additions to `sources`: `nb.*` messages from
GUI and VM, plus Paint and Blocks messages that differ from the Scratch catalog.
Those source files are the only content uploaded to NitroBolt's Transifex.

The token can instead be stored in the ignored `.tx_token` file. Pulled
translations are written only to `overrides/editor`, leaving vendored Scratch
and TurboWarp strings unchanged.

## Package API

```js
import locales, {localeData, localeMap, isRtl} from 'scratch-l10n';
import editorMessages from 'scratch-l10n/locales/editor-msgs';
```

- `locales` lists supported editor locales.
- `localeData` contains React Intl locale data.
- `localeMap` maps application locale codes to Transifex locale codes.
- `isRtl` reports whether a locale uses right-to-left text.
- The `locales` modules contain the built message catalogs.

## Attribution

This repository is derived from Scratch's `scratch-l10n` and TurboWarp's
modified distribution. Their licenses and trademarks remain their own. See
`LICENSE`, `TRADEMARK`, and the Git history for attribution.
