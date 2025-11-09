export default function sington(className){
    let instance = null
    const proxy = new Proxy(className,{
        construct(target,args){
            if(!instance){
                instance = Reflect.construct(target,args)
                Object.freeze(instance);
            }
            return instance
        },
        apply(target, thisArg, args) {
          throw new Error('单例类不能直接调用，必须使用 new 操作符');
        }
    })
    proxy.prototype.constructor = proxy
    return proxy
}