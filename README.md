# SportsStore

Thsi is just the project code for Adam Freeman's book on combining Angular with MVC Core. It's a fairly old book, but still has some good ideas in it and is still worth reading. My main contribution was to upgrade the Angular version and the coding style to version 20. Also, I replaced Freeman's repository code with my own asynchronous variant, which I think is a much more professional implementation. Of course, you can do more advanced repository models.

## The One That Got Away

The chapter on combining Blazor with Angular is hopelessly out-of-date, being based on what was then a preview. I had a reasonable go at trying to get it to work, but it was a bridge too far, and I decided to cut my losses after a couple of fruitless days. I did find a Github project doing something a bit similar, but the coding was entirely different, and I just couldn't get it to work with this project, despite a promising start. I might get back to it.

## Notes

Although the code is based on Freeman, all of it was typed by me by hand. I had to tighten up Freeman's Typescript quite a bit, as both Typescript and Angular standards have changed a lot. One glaring issue - should strings be `null`able or `undefined`? Freeman uses nulls throughout, but I have gone with `undefined` as it is the native data type of strings in TS. `Undefined` is a bit of a no-no in JavaScript coding, as it tends to be a result of, as well as a cause of, coding errors, usually meaning that you have't assigned or instantiated a variable. Also, I think `undefined` isn't "falsy", meaning it fails boolean checks. However, its use seems more idiomatic in TS. If I'm pursuaded later that `undefined` isn't a good default option, I'll come back and rewrite the affected code.
