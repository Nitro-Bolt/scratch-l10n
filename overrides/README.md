# NitroBolt translation overlays

The `editor` directory contains translations owned by NitroBolt. Files mirror
the upstream catalog layout:

```text
overrides/editor/<component>/<locale>.json
```

Supported components are `blocks`, `extensions`, `interface`, and
`paint-editor`. Each translated locale file is a flat JSON object. English
comes from `sources`; translated overrides are merged on top of the
corresponding Scratch and TurboWarp catalog during `pnpm run build`.

These files are managed through NitroBolt's Transifex project. Set `TX_TOKEN`,
then use `pnpm transifex:pull` or `pnpm transifex:push`.

Each component's NitroBolt-owned English strings are stored in `sources`.
Vendored Scratch and TurboWarp messages are not uploaded to NitroBolt's
Transifex project.

Keep upstream translations in `editor`. Do not copy upstream catalogs into
this directory. An override should contain only NitroBolt-specific strings or
intentional NitroBolt replacements.

Strings with a `tw.` ID are treated as TurboWarp-owned by default. If
NitroBolt intentionally changes one, add its ID to
`scripts/intentional-overrides.json`. New or changed Scratch strings are
detected by comparing their English text with the vendored Scratch catalog.

Locale filenames always use Scratch locale codes. The Transifex mapping in
`src/supported-locales.js` handles differing remote codes, such as Scratch's
`fil` and Transifex's `fil_PH` for Filipino (Philippines).
