<p>hey look a page<p>

<p>Here we will put a list of batches in progress & possibly the ability to print summaries
of completed ones - esp for deposit slips</p>

<table>
 {foreach from=$batches key=id item=batch}
  <tr><td><a href ='{$batch.url}'>{$batch.profile}</a></td></tr>
 {/foreach}
</table>

