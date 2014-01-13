module("Row Cloned");

test("O objeto repeticao deve estar definido", function() {
	ok($(document.body).rowCloned, "Objeto repeticao esta definido");	
});

test("Retorno da funcao deve ser o elemento que a chamou", function() {
	var $table = $('<table id="table-test"></table>');
	var $div = $('<div id="div-test"></div>');
	ok($table.rowCloned() == $table, "a própria tabela, onde foi aplicada repeticao, é retornada");	
	ok($div.rowCloned() == $div, "a própria div, onde foi aplicada repeticao, é retornada");	
});

test("Numero padrao de linhas", function() {
	var $div = $('<div><p class="row"></p></div>').rowCloned({
		initialRows: 10
	});
	equal($div.find('p.row').length, 10, "repeticao com numero de linhas padrao deve ter o numero de linhas passado no parametro");	
	
	$div = $('<div><p class="row"></p></div>').rowCloned({
		initialRows: '10'
	});
	rowCloned = $div.data('rowCloned');
	ok(rowCloned.options.initialRows === 10, "O valor passado no padrao de linhas deve ser convertido para numero");
	
	$div = $('<div><p class="row"></p></div>').rowCloned({
		initialRows: 'string'
	});
	rowCloned = $div.data('rowCloned');
	ok(rowCloned.options.initialRows === 0, "Se for passada uma string para o parametro de numero padrao de linhas, isso deve ser convertido para zero");
});

test("Numero maximo de linhas", function() {
	var $div = $('<div><p class="row"></p></div>').rowCloned({
		maxRows: {max: 3}
	}),
		rowCloned = $div.data('rowCloned');
	
	$div.find('.addRow').click();
	$div.find('.addRow').click();
	ok(rowCloned.isMaxLimit(), "Quando a repeticao chegar no limite maximo de linhas, nenhuma linha pode ser adicionada");
	
	$div = $('<div><p class="row"></p></div>').rowCloned({
		maxRows: {max: 3},
		initialRows: 5
	});
	equal($div.find('p.row').length, 3, "O numero de linhas padrao não deve ultrapassar o numero maximo de linhas");
	
	$div = $('<div><p class="row"></p></div>').rowCloned({
		maxRows: {max: '3'}
	});
	rowCloned = $div.data('rowCloned');
	ok(rowCloned.options.maxRows.max === 3, "O valor passado no max deve ser convertido para numero");
	
	$div = $('<div><p class="row"></p></div>').rowCloned({
		maxRows: {max: 'string'}
	});
	rowCloned = $div.data('rowCloned');
	ok(rowCloned.options.maxRows.max === Infinity, "Se for passada uma string para o parametro de max, isso deve ser convertido para Infinito");
	
	$div = $('<div><p class="row"></p></div>').rowCloned({
		maxRows: {max: 0}
	});
	rowCloned = $div.data('rowCloned');
	ok(rowCloned.options.maxRows.max === Infinity, "Se for passado o valor 0 para o parametro de max, isso deve ser convertido para Infinity");
});

test("Numero minimo de linhas", function() {
	var $div = $('<div><p class="row"></p></div>').rowCloned({
		minRows: {min: 3}
	}), rowCloned;
	
	$div.find('.addRow').click();	
	$div.find('.removeRow:last').click();
	rowCloned = $div.data('rowCloned');	
	ok(rowCloned.isMinLimit(), "Quando a repeticao chegar no limite minimo de linhas, nenhuma linha pode ser removida");
	
	$div = $('<div><p class="row"></p></div>').rowCloned({
		minRows: {min: 3},
		initialRows: 2
	});
	equal($div.find('p.row').length, 3, 'Se o numero de linhas padrao for menor do que o minimo, a repeticao deve ser inicializada com o numero minimo');
	
	$div = $('<div><p class="row"></p></div>').rowCloned({
		minRows: {min: '3'}
	});
	rowCloned = $div.data('rowCloned');
	ok(rowCloned.options.minRows.min === 3, "O valor passado no min deve ser convertido para numero");
	
	$div = $('<div><p class="row"></p></div>').rowCloned({
		minRows: {min: 'string'}
	});
	rowCloned = $div.data('rowCloned');
	ok(rowCloned.options.minRows.min === 0, "Se for passada uma string para o parametro de min, isso deve ser convertido para zero");
});

test("Limpar campos", function() {
	var $table = '<table id="tabela">'
		+'<tr class="row">'     
		+'    <td><input type="text" id="txt1" /></td>'
		+'    <td><input type="checkbox" id="cb1" /></td>'
		+'    <td><textarea id="txt2"></textarea></td>'
		+'    <td>'
		+'        <input type="radio" name="rd1" value="1" />Opção 1'
		+'       <input type="radio" name="rd1" value="2" />Opção 2'
		+'    </td>'
		+'    <td><select id="s1" name="s1"><option value="0">Selecionar</option><option value="1">Gabriel</option></select></td>'
		+'    <td><select multiple="multiple" class="clean" id="s2" name="s2"><option value="0">Selecionar</option><option value="1">Gabriel</option></select></td>'
		+'</tr>'
		+'</table>';
	$table = $($table);
	
	$table.rowCloned({
		allowCleanRow: true
	})
	$table.find('#txt1, #txt2').val('valor');
	$table.find('#cb1, [name=rd1]').prop('checked', true);
	$table.find('#s1').prop('selectedIndex', 1);
	
	$table.find('.cleanRow').click();	
	
	var limpouTudo = $table.find('#s1').prop('selectedIndex') === 0 && 
						!$table.find('#cb1').prop('checked') &&
						!$table.find('[rd1]').eq(0).prop('checked') &&
						!$table.find('[rd1]').eq(1).prop('checked') &&
						$table.find('#txt1').val() === '' &&
						$table.find('#txt2').val() === '' &&
						$table.find('#s2').html() === '';
	
						
	ok(limpouTudo, "Todos os campos foram limpos");	
});

test("Botao adicionar na ultima linha", function() {
	var $div = $('<div><p class="row"></p></div>').rowCloned({
		maxRows: {max: 3},
		showAddButtonLastRow: false
	});
	$div.find('.addRow').click();
	$div.find('.addRow').click();
	
	ok(!$div.find('.addRow').is(':visible'), "Quando houver maximo de linhas, na ultima linha o botao adicionar nao aparece");	
});

