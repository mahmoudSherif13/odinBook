import Post from "../models/post";
import { Request, Response, NextFunction } from "express";
import { postNotFounded } from "../errorCodes";

export function index(req: Request, res: Response, next: NextFunction): void {
  Post.find()
    .exec()
    .then((posts) => res.json(posts))
    .catch((err) => next(err));
}

export function create(req: Request, res: Response, next: NextFunction): void {
  Post.create(req.body)
    .then((post) => res.json(post))
    .catch((err) => next(err));
}

export function show(req: Request, res: Response, next: NextFunction): void {
  Post.findById(req.params.id)
    .exec()
    .then((post) => {
      if (post) {
        res.json(post);
      }
      res.status(404).json(postNotFounded);
    })
    .catch((err) => next(err));
}

export function update(req: Request, res: Response, next: NextFunction): void {
  Post.findByIdAndUpdate(req.params.id, req.body)
    .exec()
    .then((post) => {
      if (post) {
        res.json(post);
      }
      res.status(404).json(postNotFounded);
    })
    .catch((err) => next(err));
}

export function destroy(req: Request, res: Response, next: NextFunction): void {
  Post.findByIdAndDelete(req.params.id)
    .exec()
    .then((post) => {
      if (post) {
        res.json(post);
      }
      res.status(404).json(postNotFounded);
    })
    .catch((err) => next(err));
}
