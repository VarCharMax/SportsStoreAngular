# SportsStore

This is just the project code for Adam Freeman's book on combining Angular with MVC Core. It's a fairly old book (Core 3 was current at the time), but still has some good ideas in it and is still worth reading. My main contribution was to upgrade the Angular version and the coding style to version 20. Also, I replaced Freeman's repository code with my own asynchronous variant, which I think is a much more professional implementation. Of course, you can do more advanced repository models.

Freeman's approach appears to be incompatible with the new Angular build mechanism, so I avoided migrating to it. Eventually this will become impractical, presumably, so the development approach demonstated hear probably won't be usable by then.

## The One That Got Away

The chapter on combining Blazor with Angular is hopelessly out-of-date, being based on what was then a preview. I had a reasonable go at trying to get it to work, but it was a bridge too far, and I decided to cut my losses after a couple of fruitless days. I did find a Github project doing something a bit similar, but the coding was entirely different, and I just couldn't get it to work with this project, despite a promising start. I might get back to it.

## Notes

Although the code is based on Freeman, all of it was typed by me by hand. I had to tighten up Freeman's Typescript quite a bit, as both Typescript and Angular standards have changed a lot. One glaring issue - should strings be `null`able or `undefined`? Freeman uses nulls throughout, but I have gone with `undefined` as it is the native data type of strings in TS. `Undefined` is a bit of a no-no in JavaScript coding, as it tends to be a result of, as well as a cause of, coding errors, usually meaning that you have't assigned or instantiated a variable. Also, I think `undefined` isn't "falsey", meaning it fails boolean checks. However, its use seems more idiomatic in TS. If I'm pursuaded later that `undefined` isn't a good default option, I'll come back and rewrite the affected code.

## Fixes

The author's implementation of the Product Editor is dreadful, and an object lesson in how not to implement such a feature. It's also incompatible with my async reimplementation of the repository model, as it can't read and write directly to the repository, as the original design required. However, rather than completely re-implementing it, I decided to treat it as I would a legacy code issue, and come up with a fix that does not require substantially rewriting the codebase. But I think it actually came out pretty well.

The main functionality I added was validation and the ability to enable and disable the Save button in the parent component based on the validity of the form in the child.

## Observations

One thing that was puzzling me - the use of `ModelState.IsValid` in controllers. I was perplexed as to why sometimes I could use this programmatically, whereas at other times the model property validators rejected the parameter before hitting the action method code. Eventually I realised that `ModelState.IsValid` is really only for View Controllers. It doesn't work for Api Controllers, and always returns true (I'd neglected to add the `[ApiController]` attribute to the Controller in question). You can, however, add errors to the `ModelState` and return it as a `BadRequest(ModelState)`, so it has some purpose in APIs, but `.IsValid` is redundant, as least for checking for parameters. (You can, I think, use it to validate a model you've created or returned from a query, but `TryValidate()` would probably be the thing to use in that situation.)
