from pyzotero import zotero
print("Updating Bibliogrpahy... this can take a while (tm)")
zot = zotero.Zotero('220378' , 'group')
zot.add_parameters(
        content='bib', 
        style='mla', 
        itemType="-attachment",
        sort='creator',
        )
items = zot.everything(zot.top())
# we've retrieved the latest five top-level items in our library
# we can print each item's item type and ID
print(len(items))
page = u"""---
layout: page
title: Bibliography
permalink: /bibliography/
---
<style>
.csl-entry{
 margin-left: 2em; 
 text-indent: -2em 
  
}
</style>
<h2>GO-SHIP Bibliography</h2>
<ul>
"""
for item in items:
    page += u"<li>{}</li>\n".format(item)
page += u"\n</ul>"
with open("bibliography.md", "w") as f:
    f.write(page.encode("utf-8"))
