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
