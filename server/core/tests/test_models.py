from django.test import TestCase, TransactionTestCase

from ..models import Company, Job, Post, PostSolution, User


class UserModelTests(TestCase):
    def test_user_was_created(self):
        user = User.objects.create(
            username="danielraz",
            first_name="Daniel",
            last_name="Raz",
            email="danielraz@gmail.com",
        )
        self.assertTrue(isinstance(user, User))
        self.assertEqual(user.username, "danielraz")
        self.assertEqual(user.first_name, "Daniel")
        self.assertEqual(user.last_name, "Raz")
        self.assertEqual(user.email, "danielraz@gmail.com")

    def test_company_was_created(self):
        c1 = Company.objects.create(name="Microsoft", country="Israel")
        self.assertTrue(isinstance(c1, Company))
        self.assertEqual(c1.name, "Microsoft")
        self.assertEqual(c1.country, "Israel")

    def test_job_was_created(self, title="fullstack developer", seniority="junior"):
        job = Job.objects.create(title=title, seniority=seniority)
        self.assertTrue(isinstance(job, Job))
        self.assertEqual(job.title, "fullstack developer")
        self.assertEqual(job.seniority, "junior")
        c1 = Company.objects.create(name="Microsoft", country="Israel")
        job.company.add(c1)
        self.assertEqual(job.company.get(name="Microsoft").name, "Microsoft")
        self.assertEqual(job.company.get(name="Microsoft").name, "Microsoft")

    def test_post_was_created(self):
        u1 = User.objects.create(
            username="danielraz",
            first_name="Daniel",
            last_name="Raz",
            email="danielraz@gmail.com",
        )
        u2 = User.objects.create(
            username="michaeljackson",
            first_name="Michael",
            last_name="Jackson",
            email="michaeljackson@gmail.com",
        )
        j1 = Job.objects.create(title="fullstack developer", seniority="junior")

        p1 = Post.objects.create(title="TwoSum", post_type="question", job=j1)
        self.assertEqual(p1.title, "TwoSum")
        self.assertEqual(p1.post_type, "question")
        self.assertIsNone(p1.description)
        p1.user.add(u1)
        self.assertEqual(p1.user.get(first_name="Daniel").first_name, "Daniel")

        p2 = Post.objects.create(
            title="Create a simple E-Commerce Shop",
            post_type="assignment",
            description="lorem ipsum dolor",
            job=j1,
        )
        self.assertEqual(p2.title, "Create a simple E-Commerce Shop")
        self.assertEqual(p2.post_type, "assignment")
        self.assertIsNotNone(p2.description)
        self.assertEqual(p2.description, "lorem ipsum dolor")
        p2.user.add(u2)
        self.assertEqual(p2.user.get(first_name=u2.first_name).first_name, "Michael")

    def test_post_solution_was_created(self):
        u1 = User.objects.create(
            username="danielraz",
            first_name="Daniel",
            last_name="Raz",
            email="danielraz@gmail.com",
        )
        u2 = User.objects.create(
            username="michaeljackson",
            first_name="Michael",
            last_name="Jackson",
            email="michaeljackson@gmail.com",
        )
        j1 = Job.objects.create(title="fullstack developer", seniority="junior")
        p1 = Post.objects.create(title="TwoSum", post_type="question", job=j1)
        p1.user.add(u1)
        p2 = Post.objects.create(
            title="Create a simple E-Commerce Shop",
            post_type="assignment",
            description="lorem ipsum dolor",
            job=j1,
        )
        p2.user.add(u2)

        ps1 = PostSolution.objects.create(solution="This is a solution", post=p1)
        ps1.user.add(u2)
        self.assertEqual(ps1.solution, "This is a solution")
        self.assertEqual(ps1.post_id, p1.id)
        self.assertEqual(ps1.user.get(first_name="Michael").first_name, "Michael")
