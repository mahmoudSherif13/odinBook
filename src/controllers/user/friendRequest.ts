import User from "../../models/user";
import { Request, Response, NextFunction } from "express";

export async function index(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.params.userId)
      .populate("friendsRequests", "name email photoUrl")
      .exec();
    if(user?.friendsRequests?.length > 0){
      res.json(user.friendsRequests);
    }else{
      res.json({err: "no requests"})
    }
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try{
    const user = await User.findByIdAndUpdate(req.params.userId, {
      $addToSet: { friendsRequests: req.body.userId }
    }).exec();

    res.json(user);
  }catch(err){
    next(err);
  }
}

export async function destroy(req: Request, res: Response, next: NextFunction) {
  try {
    await User.findByIdAndUpdate(req.params.userId, {
      $pull: {friendsRequests: req.params.id}
    }).exec();
    res.json({done: "delete done"});
  } catch(err) {
    next(err);
  }
}

export async function accept(req: Request, res: Response, next: NextFunction){
  try {
    await User.findByIdAndUpdate(req.params.userId, {
      $pull: {friendsRequests: req.params.id},
      $addToSet: {friends: req.params.id}
    }).exec();
    
    res.json("done");
  } catch(err) {
    next(err);
  }
}