def calculate_depth(comment):
        # parent would be answer_to
        depth = -1

        def get_depth(c):
            nonlocal depth
            if c == None:
                return depth
            else:
                depth += 1
                return get_depth(c.answer_to)

        return get_depth(comment)

class Comment:
    def __init__(self, answer_to=None):
        self.answer_to = answer_to


c1 = Comment()
c2 = Comment(c1)
c3 = Comment(c2)

print(calculate_depth(c1))
print(calculate_depth(c2))
print(calculate_depth(c3))

