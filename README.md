# Doto

A command line to-do list for Deno.

## Usage

Run with the following flags:

```shell
deno run --unstable --allow-read --allow-write --allow-env index.ts
```

Dotos can be created, listed, and removed:

```shell
deno run ... create "bake bread"
> Created doto: bake bread

deno run ... list
> 1. bake bread

deno run ... remove 1
> Removed doto: bake bread
```
