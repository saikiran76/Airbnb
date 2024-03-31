const User = require('../models/user');

module.exports.renderSignup = async (req, res) => {
    try{
        let { username, email, password } = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser)
        req.login(registeredUser, (err)=>{ // Automatic login after signup
            if(err){
                return next(err);
            }
            req.flash('success', 'Welcome to FS-Tourism');
            res.redirect('/listings');
        })
        
    } catch(err){
        console.log(err);
        req.flash('error', err.message);
        res.redirect('/signup');
    }
    
}

module.exports.renderLogin = (req, res)=>{
    res.render('users/login.ejs');
}

module.exports.login = async (req, res)=>{
    req.flash('success', 'Welcome back to FS-Tourism');
    let redirect = req.session.redirectUrl || '/listings';
    res.redirect(redirect);
    // res.redirect('/listings');

} 

module.exports.logout = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");

    })
}