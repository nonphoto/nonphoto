import lume from "https://deno.land/x/lume/mod.js";

const site = lume();

site.copy("assets");

export default site;
