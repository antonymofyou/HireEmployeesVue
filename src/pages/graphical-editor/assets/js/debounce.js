/**
 *
 * Результат декоратора debounce(callback, delay) – это обёртка, которая откладывает вызовы callback,
 * пока не пройдёт delay миллисекунд бездействия (без вызовов),
 * а затем вызывает callback один раз с последними аргументами.
 *
*/
export default function debounce(callback, delay) {
    let timer;
  
    return function (...args) {
      clearTimeout(timer);
  
      timer = setTimeout(() => {
        callback.apply(this, args);
      }, delay);
    };
}