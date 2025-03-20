#!/bin/sh

rm -rf ../asset/shadcn
pnpm run build
mv dist ../asset/shadcn