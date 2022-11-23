const calk = document.querySelector('.calk');
const rez = document.querySelector('#check');
// функция передачи данных в php файл для обработки и возврата результата
function requestData(tema){ 
    const requestUri = 'calk.php'
    const xhr = new XMLHttpRequest()
    const body = 'result=' + encodeURIComponent(tema)
    xhr.open("POST",requestUri,true)
    xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
    xhr.onload = () => {
        if(xhr.status == 200 && xhr.readyState == 4){
            alert('Ваш результат: ' + xhr.response)
        }else{
            console.error(xhr.response)
        }
    }
    xhr.send(body)
}
calk.addEventListener('click', function(event){
    if(!event.target.classList.contains('calk__but')) return;
    let val = event.target.innerText;      
    // функция подсчета результата из 3 оперантов(число-знак-число)     
    function check(one,two,three){
        let result = null;
        switch(two){
            case '+':
                result = Number(one) + Number(three);break;
            case '-':
                result = Number(one) - Number(three);break;
            case '*':
                result = Number(one) * Number(three);break;
            case '/':
                result = (three == 0) ? alert('Ошибка. Делить на ноль нельзя'): Number(one) / Number(three);break;
            default:
                alert('Ошибка. Неизвестный оператор');break;                  
        }   
        if(result === undefined){
            result = Number(0);
        }    
        return result;
    }  
    function minus(numbers,first,oper){
        let perviy = numbers.at(0);
        let ones = numbers.substring(first,numbers.length,oper); 
        let point2 = ones.indexOf('.');
        let incl = ones.includes('.');
        let tri = numbers.substring(++oper,numbers.length);
          
        let incle = tri.includes('.');        
        let point3 = tri.indexOf('.',3);
       
        if(incl == true && incle == true && perviy !== '-'){
            val = '';//если точка существует в первом и в третьем операнде, то игнорируем             
        }else if(perviy === '-' && incl !== true){                       
            val = '.';//если не существует, то добавляем  
        }else if(incl == true && incle == false){
            val = '.';//если не существует, то добавляем 
        }else if(perviy === '-' && point3 == -1 && point2 == 1){            
            val = '';// единственное не знаю как сделать при точке второго операнда если впереди -(пример -8.5+9 и не поставить точку после 9 !!!)    
        }           
        return val; 
    }  

    function char(istok,zn,otr=0){//для не повторения кода
        let a = istok.substring(0,zn);//первый оперант 
        let b = istok.slice(zn,++zn);//второй оперант
        let c = istok.substring(zn);//третий оперант 
        return check(otr + a,b,c);    
    }

    function chars(sum){ //функция разбора строки по оперантам
        const numb = sum;
            let numberChar = numb.indexOf(numb.match(/[*+/-]/gi));//получение номера операнта знака 
            let minus = numb.indexOf('-');
            if(minus === 0){// если первое число отрицательное
                let nova = numb.substring(1,numb.length);
                let prov = nova.indexOf(nova.match(/[*+/-]/gi));
                let min = '-';
                return char(nova,prov,min);                
            }else{
                return char(numb,numberChar);        
            }        
    }         
    switch(val){
        case "C":
            rez.value = Number(0);break;//очистка строки
        case "del":
            let nov = rez.value;
            if(nov.length > 1){
                rez.value = nov.substring(0,nov.length-1);break;//удаление последнего символа
            }else if(nov.length === 1){
                rez.value = Number(0);break;//установка по умолчанию 0
            }        
        case "=":           
            requestData(chars(rez.value));// вывод алертом
            rez.value = chars(rez.value);//вывод результата на табло
            if(rez.value.length === 0){
                rez.value = Number(0);// если undefined выводить 0
            }
            break;
        case "+/-":
            let min = rez.value;
            let one = min.slice(0,1);
            if(one === '-'){rez.value = -rez.value;}
            else{rez.value = -rez.value;};break;//  изменение знака на противоположный   
        case "%":  
            rez.value = rez.value/100;// расчет процента
            ;break;
        default:  
                let proba = rez.value;
                let second = proba.substring(1,proba.length,1);
                let poin = proba.indexOf('.');                      
                let znak = proba.indexOf(proba.match(/[+/*-]/mi));
                
                if(rez.value === '0' && val === '0'){
                    rez.value = '';// если ноль и ноль нажат - игнорируем                   
                }else if(val === '.' && rez.value === '0' && poin == -1){
                    rez.value = '0';//если точка нажата, то ставим ноль + точка
                }else if(val === '.'){
                    let first = proba.at(0);
                    if(first === '-'){
                        minus(proba,'1',znak);
                    }else{
                        minus(proba,'0',znak);
                    }  
                }else if(rez.value === '0' && (val !== '.' || val === '.') && znak == -1){
                    rez.value = second;//смена 0 по умолчанию на нажатое число(не знак)
                }
                
            rez.value += val;           
            break;
        
    }       
})  
