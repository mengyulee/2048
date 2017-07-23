//��Ϸ����

var board = new Array();  //��Ϸ����
var score = 0;  //��Ϸ����
var hasConflicted = new Array();

$(document).ready(function(){
	prepareForMobile();
	newgame();
});

function prepareForMobile(){

    if( documentWidth > 500 ){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }
    

    
    $('#grid-container').css('width',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('height',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius',0.02*gridContainerWidth);

    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.02*cellSideLength);
}

function newgame(){
	
	//��ʼ������
	init();
	//���������������������
	generateOneNumber();
	generateOneNumber();

}

function init(){

	for(var i = 0; i < 4; i ++){
		for(var j = 0; j < 4; j ++){

			var gridCell = $("#grid-cell-"+i+"-"+j);
			gridCell.css('top', getPosTop(i, j));
			gridCell.css('left', getPosLeft(i, j));

		}
	}

	for( var i = 0 ; i < 4 ; i ++ ){
		board[i] = new Array();
		hasConflicted[i] = new Array();
		for( var j = 0 ; j < 4 ; j ++ ){
			board[i][j] = 0;
			hasConflicted[i][j] = false;
		}
	}

	score = 0;
 	updateBoardView();

 	
}

function updateBoardView() {

	$(".number-cell").remove();
	for(var i = 0; i < 4; i ++){
		for(var j = 0; j < 4; j++){
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var theNumberCell = $('#number-cell-'+i+'-'+j);

            if( board[i][j] == 0 ){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j) + cellSideLength/2 );
                theNumberCell.css('left',getPosLeft(i,j) + cellSideLength/2 );
            }
            else{
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor( board[i][j] ) );
                theNumberCell.css('color',getNumberColor( board[i][j] ) );
                theNumberCell.text( board[i][j] );
            }

            hasConflicted[i][j] = false;
        }
    }
    $('.number-cell').css('line-height',cellSideLength+'px');
    $('.number-cell').css('font-size',0.6*cellSideLength+'px');
}

function generateOneNumber() {
	if(nospace(board)){
		return false;
	}

	//���һ��λ��
	var randx = parseInt(Math.floor(Math.random() *4 ));
	var randy = parseInt(Math.floor(Math.random() *4 ));

	var time = 0;
	while(time < 50){
		if(board[randx][randy] == 0){
			break;
		}
		randx = parseInt(Math.floor(Math.random() *4 ));
		randy = parseInt(Math.floor(Math.random() *4 ));
		time ++;
	}

	if(time == 50){
		for(var i = 0; i < 4; i ++){
			for(var j = 0; j < 4; j ++){
				if(board[i][j] == 0){
					randx = i;
					randy = j;
				}
			}
		}
	}
	

	//����һ�������
	var randNumber = Math.random() < 0.5?2 : 4;
	//���λ����ʾ�����
	board[randx][randy] = randNumber;
	showNumberWithAnimation(randx, randy, randNumber);

	return true;
}

$(document).keydown(function (event) {
	switch(event.keyCode){
		case 37:
		if(moveLeft()){
			setTimeout("generateOneNumber()",210);
			setTimeout("isgameover()",300);
		} 
		break;
		case 38: 
		if(moveUp()){
			setTimeout("generateOneNumber()",210);
			setTimeout("isgameover()",300);
		} 
		break;
		case 39: 
		if(moveRight()){
			setTimeout("generateOneNumber()",210);
			setTimeout("isgameover()",300);
		} 
		break;
		case 40: 
		if(moveDown()){
			setTimeout("generateOneNumber()",210);
			setTimeout("isgameover()",300);			
		} 
		break;
		default: 
		break;
	}
});

function isgameover() {
	if(nospace(board) && nomove(board)){
		gameover();
	}
}

function gameover() {
	alert("gameover!");
}

function moveLeft() {
	if( !canMoveLeft(board) )
		return false;
	//moveLeft
	//1.���λ���Ƿ�Ϊ��
	//2.���λ�������Ƿ����
	//3.·�����Ƿ����ϰ�

	for(var i = 0; i < 4; i ++){
		for(var j = 1; j < 4; j ++){
			if(board[i][j] != 0){ //���ƶ�Ԫ��
				for(var k =0; k < j; k ++){ //�������ƶ�Ԫ�ص����Ԫ��
					if(board[i][k] == 0 && noBlockHorizontal(i, k, j, board)){
						//move
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if(board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]){
						//move
						showMoveAnimation(i, j, i, k);
						//add
						board[i][k] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[i][k];
						updateScore( score );

						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
	}

	setTimeout("updateBoardView()",200);
	return true;
}

function moveRight() {
	if( !canMoveRight(board) )
		return false;
	//moveRight
	//1.���λ���Ƿ�Ϊ��
	//2.���λ�������Ƿ����
	//3.·�����Ƿ����ϰ�

	for(var i = 0; i < 4; i ++){
		for(var j = 2; j >= 0; j --){
			if(board[i][j] != 0){ //���ƶ�Ԫ��
				for(var k =3; k > j; k --){ //�������ƶ�Ԫ�ص��Ҳ�Ԫ��
					if(board[i][k] == 0 && noBlockHorizontal(i, j, k, board)){
						//move
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if(board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]){
						//move
						showMoveAnimation(i, j, i, k);
						//add
						board[i][k] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[i][k];
						updateScore( score );

						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
	}

	setTimeout("updateBoardView()",200);
	return true;
}

function moveUp() {
	if( !canMoveUp(board) )
		return false;
	//moveUp
	//1.���λ���Ƿ�Ϊ��
	//2.���λ�������Ƿ����
	//3.·�����Ƿ����ϰ�

	for(var i = 1; i < 4; i ++){
		for(var j = 0; j < 4; j ++){
			if(board[i][j] != 0){ //���ƶ�Ԫ��
				for(var k =0; k < i; k ++){ //�������ƶ�Ԫ�ص��ϲ�Ԫ��
					if(board[k][j] == 0 && noBlockVertical(j, k, i, board)){
						//move
						showMoveAnimation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if(board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]){
						//move
						showMoveAnimation(i, j, k, j);
						//add
						board[k][j] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[k][j];
						updateScore( score );
						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		}
	}

	setTimeout("updateBoardView()",200);
	return true;
}



function moveDown() {
	if( !canMoveDown(board) )
		return false;
	//moveDown
	//1.���λ���Ƿ�Ϊ��
	//2.���λ�������Ƿ����
	//3.·�����Ƿ����ϰ�

	for(var i = 2; i >= 0; i --){
		for(var j = 0; j < 4; j ++){
			if(board[i][j] != 0){ //���ƶ�Ԫ��
				for(var k =3; k > i; k --){ //�������ƶ�Ԫ�ص��ϲ�Ԫ��
					if(board[k][j] == 0 && noBlockVertical(j, i, k, board) ){
						//move
						showMoveAnimation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if(board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]){
						//move
						showMoveAnimation(i, j, k, j);
						//add
						board[k][j] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[k][j];
						updateScore( score );
						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		}
	}

	setTimeout("updateBoardView()",200);
	return true;
}

