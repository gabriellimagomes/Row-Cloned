(function($){ 'use strict';

	// CLASS DEFINITION
	
	var RowCloned = function(container, options){
		this.$container = $(container);
		this.options = options;
		this.isContainerTable = (this.$container.prop('tagName').toLowerCase() === 'table');
		this.options.initialRows = getNumber(this.options.initialRows); 
		this.options.maxRows.max = getMaxNumber(this.options.maxRows.max); 
		this.options.minRows.min = getNumber(this.options.minRows.min); 
		this.init();
	};
	
	RowCloned.DEFAULTS = {
		emptyNewRow: true,
		srcImgAdd: 'img/add.png',
		srcImgRemove: 'img/remove.png',
		srcImgClean: 'img/clear.png',								
		addRow: function(){},
		removeRow: function(){},
		initialRows: 0,
		maxRows: {
			max: Infinity,
			message: 'Não é possível adicionar outra linha, quantidade máxima de linhas atingida.'
		},
		minRows: {
			min: 1,
			message: 'Não é possível remover a linha, quantidade mínima de linhas atingida.'
		},
		showAddButtonLastRow: true,
		allowCleanRow: true
	};
	
	
	RowCloned.prototype = {
			constructor: RowCloned,
			
			init: function(){
				this.buildBtnAddRow();
				this.attachAddEvent();
                this.attachRemoveEvent();
				this.attachCleanEvent();
				this.buildBtnRemoveRow();
				this.getLastRow().append(this.$btnAddRow);
				this.getRowsButLastRow().append(this.$btnRemoveRow);
				this.initializefirstRows(this.options.initialRows);
			},
			
			addRow: function(){
				
				if (this.isMaxLimit()){
					window.alert(this.options.maxRows.message);
					return;
				}
				
				var $lastRow = this.$container.find('.row:last'), 
					$newRow = $lastRow.clone();		
				
				if (this.options.emptyNewRow){
					cleanValues($newRow);
				}
				
				if (this.options.addRow.call(this, $newRow, $lastRow) !== false){
					$lastRow.append(this.$btnRemoveRow.clone(true));		
					$lastRow.find('.addRow').parent().remove();
					$newRow.insertAfter(this.getLastRow());
					
					displayAddButtonInLastRow(this, $newRow);
				}
			},
			
			removeRow: function(event){
				
				if (this.isMinLimit()){
					window.alert(this.options.minRows.message);
					return;
				}
				
				var $removeRow = $(event.target).parents('.row:first');
				if (this.options.removeRow.call(this, $removeRow) !== false){
					$removeRow.remove();
					
					displayAddButtonInLastRow(this, this.getLastRow());
				}
			},
		
			cleanRow: function(){
				cleanValues(this.getLastRow());
			},
			
			buildBtnAddRow: function(){
				var $btnAdd = $('<img>', {
					'css'  : {'cursor': 'pointer'},
					'class': 'addRow',
					'src'  : this.options.srcImgAdd					 
				});
				var $btnClean = '';
				if (this.options.allowCleanRow){
					$btnClean = $('<img>', {
						'css'  : {'cursor': 'pointer'},
						'class': 'cleanRow',
						'src'  : this.options.srcImgClean						
					});
				}
				
				var parent = (this.isContainerTable ? '<td>' : '<span>');
				this.$btnAddRow = $(parent, {
					'class': 'controls',
					'append': $.merge($btnAdd, $btnClean)				
				});
			},
			
			buildBtnRemoveRow: function(){
				var $btnRemove = $('<img>', {
					'css'  : {'cursor': 'pointer'},
					'class': 'removeRow',
					'src'  : this.options.srcImgRemove					
				});
				
				var parent = (this.isContainerTable ? '<td>' : '<span>');
				this.$btnRemoveRow = $(parent, { 
					'class': 'controls',
					'append': $btnRemove
				});
			},
			
			initializefirstRows: function(numberOfRowsToInitialize){
				if (this.options.minRows.min > numberOfRowsToInitialize){
					numberOfRowsToInitialize = this.options.minRows.min;
				}
				if (numberOfRowsToInitialize > this.options.maxRows.max){
					numberOfRowsToInitialize = this.options.maxRows.max;
				}
				
				for (var i=this.getNumberOfRows(); i<numberOfRowsToInitialize; i++){
					this.addRow();
				}
			},
			
			getLastRow: function(){
				return this.$container.find('.row:last');
			},
			
			getRowsButLastRow: function(){
				return this.getLastRow().siblings('.row');
			},
			
			getRows: function(){
				return this.$container.find('.row');
			},
			
			getNumberOfRows: function(){
				return this.getRows().length;
			},
			
			isMaxLimit: function(){
				if (this.getNumberOfRows() >= this.options.maxRows.max){					
					return true;
				}
				return false;
			},
			
			isMinLimit: function(){
				if (this.getNumberOfRows() <= this.options.minRows.min){					
					return true;
				}
				return false;
			},
			
			attachAddEvent: function(){
				this.$container.on('click.rowCloned', '.addRow', $.proxy(this.addRow, this));
			},
			
			attachRemoveEvent: function(){
				this.$container.on('click.rowCloned', '.removeRow', $.proxy(this.removeRow, this));
			},
			
			attachCleanEvent: function(){
				this.$container.on('click.rowCloned', '.cleanRow', $.proxy(this.cleanRow, this));
			}
	};
	
	var cleanValues = function($newRow){
		$newRow.find('input[type=text],input[type=hidden],textarea').prop('value', '');
		$newRow.find('input[type=checkbox],input[type=radio]').prop('checked', false).removeAttr('checked');
		$newRow.find('select').prop('selectedIndex', 0);
		$newRow.find('select[multiple].clean,textarea').empty();
	};   
	
	var getNumber = function(param){
		return isNaN(param) ? 0 : parseInt(param, 10);
	};
             
    var getMaxNumber = function(param){
		var max = getNumber(param);
		return max === 0 ? Infinity : max;
	};
	
	var displayAddButtonInLastRow = function(objRowCloned, $lastRow){
		if (!objRowCloned.options.showAddButtonLastRow && objRowCloned.getNumberOfRows() === objRowCloned.options.maxRows.max){
			$lastRow.find('.addRow').hide();
		}else{
			$lastRow.find('.addRow').show();
		}
	};
	
	// PLUGIN DEFINITION
	
	$.fn.rowCloned = function(objOptions){
		var $container,
			rowCloned,
			options;
		
		return this.each(function(){
			$container = $(this);
			
			if (!$container.length){		
				return;
			}
			
			rowCloned = $(this).data('rowCloned');
			if (!rowCloned){
				options = $.extend(true, {}, RowCloned.DEFAULTS, $(this).data(), objOptions);
				rowCloned = $(this).data('rowCloned', new RowCloned($container, options));
			}
		});
	};
	
	$.fn.rowCloned.Constructor = RowCloned;

})(window.jQuery);