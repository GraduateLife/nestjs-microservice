似乎有戏,
尝试用ProvideProperty装饰器给REstfulController提供Service依赖
这会导致一下结果:

- 因为这个装饰器本质是再继承一次,那么会导致在寻找控制器模板的时候要在往上找一次先祖Class
- pipe显示value是undefined, 我猜测是因为被继承的中间层也应该是一个Controller, 或者应该优化装饰器逻辑让他每个方法都super()?

速更:没戏!
不能再包一层Controller因为这样得要在module注册了
也不能在中间层用super的方法,直接显示没有repository的方法(eg, findManyInPageByQuery)

目前能做到的事情:
crud"基本"没有问题,
可以通过argumentData知道这个dto在哪里,也能做dto定义的验证了
但是pipe对于这个dto是通过什么http方法来的他并不知道,或者其实并不用关心
如果有一个以上的参数?比如说在queryString上有dto,body上也有?
那么这两个参数会分两次进入pipe, 但是是qs和body哪个先进去是不确定的
发现什么问题了吗?pipe对http方法不关心,那么我们create用post,update用patch,但是都用了body,怎么办

使用@SerializationOption和@Expose来区别dto, nest自带的序列化器没发现有什么用
again,接下来继续在dto装饰器里注册group,用plainToInstance的时候给个group就行<=doing

序列化器可以分成两个吗?一个处理mongodb,一个处理restful view

Q:能不能搞一个useDatabase钩子, paramPipe需要解析objectId,说实话我不想让这个在service里报错
A: 不行,破坏了代码层级

树形?这样的话原来的分页需要改一下了

Q:软删除功能
A:done

Q:swagger集成和mocker
A: swagger完成,mocker有点问题

Q:mongodb不需要\_\_v,用redis做锁
A:done

从控制器方法名字上获取group名字是个好主意吗?,这样就不需要Restful type了,反正也没什么用
A:done
