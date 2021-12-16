---
title: Summon me a name!
date: '2021-12-07T20:43:00.000Z'
description: 'Yet another name generator for your TTRPG. Need an elf, dwarf, human or halfling name - it is just an infernal invocation away ...'
featuredImage:
  path: ksenia-yakovleva-cBkHr5RuooA-unsplash.jpg
  alt: Witch's Runes
  credit: Ksenia Yakovleva
  link: https://unsplash.com/@ksyfffka07?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

So I built a table top RPG fantasy name generator. I did this not because it was easy, but because I thought it was going to be easy.

But some better reasons where:

1. to enter [PROCJAM](https://www.procjam.com/) this year
2. a suspicion that fantasy name generators could have a better UI
3. wanting a name generator that is editable

Hopefully this first release achieves one and two; with the (foolish) intent to cover three and make it editable over the course of PROCJAM.

## What magic is this?

Procedural generation of names sounds cool, and it is - just not this generator, if your after the neural net trained in elvish philology, you'll need to look elsewhere. This generator is picking first names and last names from human/dwarf/elf/halfling specific lists. For most TTRPG use cases this is enough.

But what if you really wanted to tweak the names? Bear with me, but what if your fantasy campaign world is not a thinly disguised British Isles circa 600 AD? Or you do not want dwarves with names that sound like they stumbled off the last train out of Glasgow on a saturday night?

Well for that, we need an editable name generator, and that is the plan. Or more correctly the play is:

1. Allow downloading of a markdown file containing the name lists
2. Allow uploading of an edited version of the file in the name generator
3. Support changing the way name lists are combined to form names
4. Support changing the schema that determines the input parameters

In my mind an export file would look something like:

```markdown
---
version: 0
---

# Boring Name List

## Specs

| spec                                         | tags        |
| -------------------------------------------- | ----------- |
| {{Human first name}} {{Human second name}}   | #race:human |
| {{Dwarf first name}} Mc{{Dwarf second name}} | #race:dwarf |

## Human first name

- Tom
- Dick
- Harry

## Human second name

- Weaver
- Smith
- Dopepeddler

## Dwarf first name

- Morag
- Dougal

## Dwarf second name

- Doomhammer
- Donald
```

Where the tags act as a filter mechanism based on input parameters (i.e. race/gender/location/job etc), leaving the generator with a set of specs to pick from. On picking a spec the generator resolves the missing variables at random using the lists in the file.

Anyway, that is the plan, lets see how far we get.

> The code is GPLv3 and on github at: https://github.com/kanej/dungeon-notes
