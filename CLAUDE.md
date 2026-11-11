# iso8601-duration

- **Temporal is the reference.** The goal of this package is to match `Temporal.Duration` as closely as possible. Before proposing or changing behaviour, check what the native `Temporal` (Node.js 26+) does for the same input, and test against it.
- **Releases are expensive downstream.** Many packages depend on this one, and every published version triggers update PRs, CI runs and npm-outdated warnings for them. Don't suggest a release for small fixes or internal changes. They are merged to master and go out with the next release that is actually needed.
