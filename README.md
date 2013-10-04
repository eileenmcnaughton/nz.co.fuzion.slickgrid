nz.co.fuzion.slickgrid
======================

Using slick grid for data entry batches

This Repo contains a submodule - make sure you run
git submodule update --init after downloading!

Note that Civi appears to load these js files before it's own jquery so jquery seems to have to be loaded in it


TODOs include

1)"
You can easily use the onCellChange event to run some code after the cell has been edited.
You can also intercept all cell edits and have complete control over how and when those edits are committed by specifying a custom handler
by setting the editCommandHandler grid option.
Due to the disconnected nature of applyValue() and serializeValue(), you can even undo your changes after you commit them.
This can be especially handy if you are editing a remote data source – you can apply the changes and make an AJAX call passing the
undo callback as the error handler, so that your data doesn’t get out of sync i
f the server cannot save the values. You can also queue up the edit commands and implement undo/redo functionality in just a few lines of

2) Example of local storage : http://stackoverflow.com/questions/11240830/how-to-save-a-slickgrid-column-order-js
