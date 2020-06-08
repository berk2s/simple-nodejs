var express = require('express');
var router = express.Router();

// jwt
const jwt = require('jsonwebtoken');

// bcrypt
const bcrypt = require('bcryptjs');

// relevant model
const User = require('../Models/User');
const UserAddress = require('../Models/UserAddress');
const ShoppingList = require('../Models/ShoppingList');

//config
const {PANEL_URL} = require('../constants/config');

//cors
var cors = require("cors");

var corsOptions = {
  origin: PANEL_URL,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

router.get('/', cors(corsOptions), async (req, res, next) => {
  try{
      const data = await User.find({});
      res.json({
          data: data,
          status: {
              state: true,
              code: 'FU_1'
          }
      })
  }catch(e){
      res.json(e);
  }
});

router.get('/detail/:user_id', async (req, res, next) => {
   try{
       const {user_id} = req.params;
       const user = await User.findOne({_id : user_id});
       res.json({
           data: user,
           status: {
               state: true,
               code: 'FU_1'
           }
       })
   }catch{
       res.json(e);
   }
});

router.put('/name', async (req, res, next) => {
    try{
        const {user_id, name_surname} = req.body;
        const user = await User.findByIdAndUpdate(user_id, {
            name_surname: name_surname
        })
        res.json({
            data: user,
            status: {
                state: true,
                code: 'UU_1'
            }
        })
    }catch(e){
        res.json(e);
    }
})

router.put('/permission/email', async (req, res, next) => {
    try{
        const {user_id, value} = req.body;
        const user = await User.findByIdAndUpdate(user_id, {
            permission_email: value
        })
        res.json({
            data: user,
            status: {
                state: true,
                code: 'UU_1'
            }
        })
    }catch(e){
        res.json(e);
    }
})

router.put('/permission/sms', async (req, res, next) => {
    try{
        const {user_id, value} = req.body;
        const user = await User.findByIdAndUpdate(user_id, {
            permission_sms: value
        })
        res.json({
            data: user,
            status: {
                state: true,
                code: 'UU_1'
            }
        })
    }catch(e){
        res.json(e);
    }
})

router.get('/address/:user_id', async (req, res , next) => {
    try{
        const {user_id} = req.params
        const address = await UserAddress.find({user_id: user_id}).sort({_id: -1});
        res.json({
            data: address,
            status: {
                state: true,
                code: 'AF_1'
            }
        })
    }catch(e){
        res.json(e);
    }
});

router.post('/address', async (req, res ,next) => {
    try{
        const {address_ltd, address_lng, user_id, address_title, address_province, address_county, address, address_direction} = req.body;
        const addAddress = new UserAddress({
            user_id:user_id,
            address_title:address_title,
            address_province:address_province,
            address_county:address_county,
            address:address,
            address_direction:address_direction,
            address_ltd:''+address_ltd,
            address_lng:''+address_lng
        });
        const save = await addAddress.save();
        const addresies = await UserAddress.find({user_id: user_id}).sort({_id: -1});
        res.json({
            data: addresies,
            status: {
                state: true,
                code: 'AC_1'
            }
        })
    }catch(e){
        res.json(e);
    }
})

router.delete('/address/:user_id/:address_id', async (req, res, next) => {
    try{
        const {user_id, address_id} = req.params;
        await UserAddress.findByIdAndDelete(address_id);
        const address = await UserAddress.find({user_id: user_id}).sort({_id: -1});
        res.json({
            data: address,
            status: {
                state: true,
                code: 'AF_1'
            }
        });
    }catch(e){
        res.json(e);
    }
})

router.put('/address' , async (req, res, next) => {
    try{
        const {id, user_id, address_title, address_province, address_county, address, address_direction} = req.body;
        const update = await UserAddress.findByIdAndUpdate(id, {
            address_title:address_title,
            address_province:address_province,
            address_county:address_county,
            address:address,
            address_direction:address_direction,
        });
        const addressUpdate = await UserAddress.find({user_id: user_id}).sort({_id: -1});
        res.json({
            data: addressUpdate,
            status: {
                state: true,
                code: 'AF_1'
            }
        });
    }catch(e){
        res.json(e);
    }
})

router.put('/token', async (req, res, next) => {
    try{
        const {token, user_id} = req.body;
        console.log('token:', token);
        console.log('userid:', user_id)
        const updateUserToken = await User.findByIdAndUpdate(user_id, {
            token:token
        });
        res.json({
            data: updateUserToken,
            status: {
                state: true,
                code: 'UU_1'
            }
        })
    }catch(e){
        res.json(e);
    }
})

router.put('/password', async (req, res, next) => {
    try{
        const {currentpassword, newpassword, userid} = req.body;

        const user = await User.findOne({_id:userid});

        bcrypt.compare(currentpassword, user.password)
            .then((result) => {
                if(result) {

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newpassword, salt, async (err, hash) => {
                            const findUser = await User.findByIdAndUpdate(userid, {
                                password: hash
                            });
                            res.json({
                                data: 'Şifre değiştirildi',
                                status: {
                                    state: true,
                                    code: 'RP_2',
                                }
                            });
                        });
                    });

                    return false;
                }else{
                    res.json({
                        data: 'Mevcut şifre hatalı',
                        status: {
                            state: true,
                            code: 'RP_1'
                        }
                    });
                    return false;
                }
            })


    }catch(e){

        res.json({
            data: 'Beklenmedik hata',
            status: {
                state: true,
                code: 'RP_1'
            }
        })

    }
})

router.put('/branch', async (req, res, next) => {
   try{
       const {user_id, branch} = req.body;
       const update = await User.updateOne({_id:user_id}, {
          user_branch: branch
       });
       res.json({
           data:update,
           status:{
               code:'UB_1',
               state:true
           }
       })
   } catch(e){
       res.json({
           data:'error',
           status:{
               code:'EE_1',
               state:true
           }
       });
   }
});

router.get('/shoppinglist/:user_id', async (req, res, next) => {
    try{
        const {user_id} = req.params;
        const data = await ShoppingList.find({user_id : user_id}).sort({_id: -1});;
        res.json({
            data: data,
            status: {
                state: true,
                code: 'FU_1'
            }
        })
    }catch(e){
        res.json({
            data: e,
            status: {
                state: true,
                code: 'FU_1'
            }
        })
    }
});

router.post('/shoppinglist', async (req, res, next) => {
    try{
        const {user_id, products, list_name} = req.body;

        const setValues = new ShoppingList({
           user_id:user_id,
           list_name:list_name,
           products: products
        });

        const saveList = await setValues.save();

        const shoppingLists = await ShoppingList.find({user_id:user_id});

        res.json({
            data: shoppingLists,
            relevant_id:saveList._id,
            state: {
                status: true,
                code: 'LS_1'
            }
        });

    }catch(e){
        res.json({
            data: e,
            state: {
                status: true,
                code: 'EE_1'
            }
        });
    }
})

router.post('/shoppinglist/check/products', async(req,res, next) => {
    try{
        const {user_id, products} = req.body;
        const findUsersList = await ShoppingList.find({user_id:user_id});

        if(findUsersList.length > 0){
            const checkerPromise = findUsersList.map(e => e.products).map(async e => {
                return new Promise(async (resolve, reject) => {
                    if(products.length == e.length){
                        const checkPromise = products.map(r => r.id).map(a => {
                            return new Promise((resolve, reject) => {
                                if(e.map(t => t.id).indexOf(a) !== -1){
                                    resolve({exists: true});
                                }else{
                                    resolve({exists: false});
                                }
                            });
                        });
                        const results = await Promise.all(checkPromise);
                        if(results.filter(e => e.exists == true).length == products.length){
                            resolve(false)
                        }else{
                            resolve(true);
                        }
                    }else{
                        resolve(true);
                    }
                });
            });
            const checkerAll = await Promise.all(checkerPromise);
            if(checkerAll.includes(false)){
                res.json({
                    data: 'Bu ürünlerden oluşan sepetiniz var',
                    state: {
                        status: true,
                        code: 'CS_2'
                    }
                });
            }else{
                res.json({
                    data: 'OK!',
                    state: {
                        status: true,
                        code: 'CS_3'
                    }
                });
            }
        }else{
            res.json({
                data: e,
                state: {
                    status: true,
                    code: 'CH_1'
                }
            });
        }

    }catch(e){
        res.json({
            data: e,
            state: {
                status: true,
                code: 'EE_1'
            }
        });
    }
})

router.post('/shoppinglist/check', async (req, res, next) => {
   try{
       const { user_id, list_name, products } = req.body;

       const checkLength = await ShoppingList.find({user_id:user_id});

       if(checkLength.length == 10){
           res.json({
               data: 'En fazla 10 tane liste oluşturabilirsiniz',
               state: {
                   status: true,
                   code: 'CS_0'
               }
           });
           return false;
       }

       const checkName = await ShoppingList.findOne({user_id:user_id, list_name: list_name});

       if(checkName == null) {
           res.json({
               data: 'Kullanılabilir isim',
               state: {
                   status: true,
                   code: 'CS_1'
               }
           });

       }else{
           res.json({
               data: 'Bu isimde alışveriş listeniz var',
               state: {
                   status: true,
                   code: 'CS_0'
               }
           });
       }

   } catch(e) {
       res.json({
           data: e,
           state: {
               status: true,
               code: 'EE_1'
           }
       });
   }
});

router.post('/shoppinglist/check2', async (req, res, next) => {
   try{
       const { user_id, list_name } = req.body;

       const checkName = await ShoppingList.findOne({user_id:user_id, list_name: list_name});

       if(checkName == null) {
           res.json({
               data: 'Kullanılabilir isim',
               state: {
                   status: true,
                   code: 'CS_1'
               }
           });

       }else{
           res.json({
               data: 'Bu isimde alışveriş listeniz var',
               state: {
                   status: true,
                   code: 'CS_0'
               }
           });
       }

   } catch(e) {
       res.json({
           data: e,
           state: {
               status: true,
               code: 'EE_1'
           }
       });
   }
});

router.delete('/shoppinglist/:user_id/:shoppinglist_id', async (req, res, next) => {
    try{
        const {user_id, shoppinglist_id} = req.params;
        await ShoppingList.findByIdAndDelete(shoppinglist_id);
        const list = await ShoppingList.find({user_id: user_id}).sort({_id: -1});
        res.json({
            data: list,
            status: {
                state: true,
                code: 'DS_1'
            }
        });
    }catch(e){
        res.json({
            data: e,
            status: {
                state: true,
                code: 'EE_1'
            }
        });
    }
})

router.put('/shoppinglist/product', async (req, res, next) => {
    try{
        const {shopping_id, products, user_id} = req.body;
        const update = await ShoppingList.updateOne({_id:shopping_id}, {
            products: products
        }, );
        console.log(products)
        const shoppingLists = await ShoppingList.find({user_id:user_id});
        res.json({
            data:shoppingLists,
            status:{
                code:'US_1',
                state:true
            }
        })
    } catch(e){
        res.json({
            data:'error',
            status:{
                code:'EE_1',
                state:true
            }
        });
    }
})

router.put('/shoppinglist/name', async (req, res, next) => {
    try{
        const {shopping_id, list_name, user_id} = req.body;
        const update = await ShoppingList.updateOne({_id:shopping_id}, {
            list_name: list_name
        }, );
        res.json({
            data:update,
            status:{
                code:'US_1',
                state:true
            }
        })
    } catch(e){
        res.json({
            data:'error',
            status:{
                code:'EE_1',
                state:true
            }
        });
    }
})

module.exports = router;
