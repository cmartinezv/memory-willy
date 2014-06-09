 <div id="${id}" class="modal">
 	<div class="modal-body">
 		{{if closebutton}} 
 			<div class="modal-close-btn panel">
 				<i class="icon-close"></i>
 			</div>
 		{{/if}}
 		<div class="modal-content">{{html message}} </div>
 		{{if button}}
			<button class="btn" id="${button.id}">${button.text}</button>
 		{{/if}}
 	</div>
 </div>