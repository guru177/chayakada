# Local audio files

This mixer does **not** stream songs from kattanchaya.in. Put files you own or have a license for here, then list them in `src/data.ts`.

## Songs (radio)

1. Copy `.mp3` or `.ogg` files into `public/audio/songs/`.
2. Add a track in `RADIO_TRACKS`:

```ts
{
  id: "evening",
  title: "സന്ധ്യ റേഡിയോ",
  artist: "Kada Radio",
  src: "/audio/songs/evening.mp3",
}
```

Tracks without `src` keep the built-in lo-fi generated radio.

## Ambience loops

These recordings are in `public/audio/ambience/`:

| Layer | File |
| --- | --- |
| Rain | `rain.m4a` |
| Thunder | `thunder.m4a` |
| Crickets | `crickets.m4a` |
| Chatting | `chatting.m4a` (people / kada crowd) |
| Fire | `fire.m4a` |
| Birds | `birds.m4a` |
| Wind | `wind.m4a` |

They are wired in `AMBIENCE_LOOPS` in `src/data.ts`. To replace a layer, overwrite the file or change the path. Omit a key to fall back to the synthesized version.
