import User from "../../models/user";
import { Request, Response, NextFunction } from "express";

export async function index(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.params.userId)
      .populate("friends", "name email photoUrl")
      .exec();
    if(user?.friends?.length > 0){
      res.json(user.friends);
    }else{
      res.json({err: "no friends"})
    }
  } catch (err) {
    next(err);
  }
}

export async function destroy(req: Request, res: Response, next: NextFunction) {
  try {
    await User.findByIdAndUpdate(req.params.userId, {
      $pull: {friends: req.params.id}
    }).exec();
    res.json({done: "delete done"});
  } catch(err) {
    next(err);
  }
}