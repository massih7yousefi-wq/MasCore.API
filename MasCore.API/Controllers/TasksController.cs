using MasCore.API.DTOs.Task;
using MasCore.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MasCore.API.Controllers;

[ApiController]
[Route("api/tasks")]
[Authorize(Roles = "Admin")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _service;

    public TasksController(ITaskService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(
            await _service.GetAllAsync());
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var task =
            await _service.GetByIdAsync(id);

        return task is null
            ? NotFound()
            : Ok(task);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateTaskDto dto)
    {
        var result =
            await _service.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = result.Id },
            result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateTaskDto dto)
    {
        var result =
            await _service.UpdateAsync(id, dto);

        return result is null
            ? NotFound()
            : Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted =
            await _service.DeleteAsync(id);

        return deleted
            ? NoContent()
            : NotFound();
    }
}