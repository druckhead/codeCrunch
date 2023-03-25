from rest_framework.routers import DefaultRouter

from ..views import UserViews, PostViews, CompanyViews, JobViews

router = DefaultRouter(trailing_slash=False)
router.register("users", UserViews.UserViewSet, basename="users")
router.register("companies", CompanyViews.CompanyViewSet)
router.register("jobs", JobViews.JobViewSet)
router.register("posts", PostViews.PostViewSet)
router.register("post_solutions", PostViews.PostSolutionViewSet)

urlpatterns = []

urlpatterns.extend(router.urls)
