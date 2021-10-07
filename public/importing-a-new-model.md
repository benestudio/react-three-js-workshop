To import a new model, download your model of choice from sketchfab (or other sites) possibly in GLTF format.

Unzip the assets, and copy them in a folder that's served by your web-server. `public/` is a good place for us. Place them in a unique path, to avoid collision on licences (if any) and file names.

If you change file names of assets (for easier addressing, etc), make sure to update the references to the files in the `.gltf` file too.

Once you have the files ready, run the `gltfjsx` tool to generate the wrapper object that addresses the GLTF file, like such:

```shell
cd src/
gltfjsx ../public/models/plane/plane.gltf -t -k -m
```

The used parameters correspond to:
```shell
-t  > use typescript (tsx)
-k  > keep original names (could help with trimming later)
-m  > keep metadata (some verbosity doesn't hurt)
```

I couldn't make the serving path generated properly into the script, so go ahead and manually replace the 2 instances of the path where the resource should be served from, to the path where you'd be accessing the resource. In our case: `/models/<name>/<name>.gltf`. 
The referred resources inside the GLTF file will be calculated relative to the GLTF file.

Now you can include your model in your scene, and instantiate it as a react node.

If the model doesn't show up, make sure to check the console for errors. If there are errors, fix them. 
Typically: 
 - some path isn't correct

Once everything loads without an issue, and you still don't see your model, try zooming back and forth, or re-scaling your model, until you start to see it. 

Finally: if you can, try to remove the unnecessary groups/elements from the generated `tsx` file. These can be preserved due to the generated nature of a models to a GLTF file.
